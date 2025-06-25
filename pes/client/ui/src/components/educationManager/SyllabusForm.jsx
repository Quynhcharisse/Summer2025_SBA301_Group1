import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useFieldArray, useForm, Controller} from 'react-hook-form';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import {enqueueSnackbar} from 'notistack';
import {Add} from '@mui/icons-material';
import {createSyllabus, getAllLessons, updateSyllabus} from "../../services/EducationService.jsx";

const LessonItem = memo(({
                             item,
                             index,
                             control,
                             register,
                             remove,
                             allLessons,
                             errors,
                             loading,
                             watch
                         }) => {
    const selectedLessonId = watch(`lessons.${index}.id`);
    
    return (
        <Box key={item.id} sx={{border: 1, borderRadius: 1, p: 2, mb: 2}}>
            <FormControl fullWidth margin="dense" error={!!errors?.lessons?.[index]?.id}>
                <InputLabel id={`lesson-select-label-${index}`}>Lesson</InputLabel>
                <Controller
                    name={`lessons.${index}.id`}
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <Select
                            {...field}
                            labelId={`lesson-select-label-${index}`}
                            label="Lesson"
                            value={field.value || ""}
                            disabled={loading}
                            onChange={(e) => field.onChange(Number(e.target.value) || "")}
                        >
                            <MenuItem value="">
                                <em>Select Lesson</em>
                            </MenuItem>
                            {allLessons && Array.isArray(allLessons) && allLessons.map(lesson =>
                                lesson && lesson.id ? (
                                    <MenuItem key={lesson.id} value={Number(lesson.id)}>
                                        {lesson.topic || `Lesson #${lesson.id}`} (ID: {lesson.id})
                                    </MenuItem>
                                ) : null
                            )}
                        </Select>
                    )}
                />
                {errors?.lessons?.[index]?.id && <FormHelperText>Lesson selection is required</FormHelperText>}
            </FormControl>

            {allLessons && selectedLessonId && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {allLessons.find(l => Number(l.id) === Number(selectedLessonId))?.description || ''}
                </Typography>
            )}

            <Divider sx={{my: 2}}/>

            <TextField
                label="Description"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                placeholder="Add description about this lesson (optional)"
                defaultValue={item.description || ""}
                {...register(`lessons.${index}.description`)}
                disabled={loading}
                sx={{mb: 1}}
            />

            <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{mt: 1}}
                onClick={() => remove(index)}
                disabled={loading}
            >
                Remove Lesson
            </Button>
        </Box>
    );
});

export default function SyllabusForm({open, onClose, syllabus, isEdit}) {
    const [allLessons, setAllLessons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [addingLesson, setAddingLesson] = useState(false);
    const lessonsProcessedRef = useRef(false);

    const formMethods = useForm({
        defaultValues: {
            syllabusId: null,
            title: '',
            description: '',
            lessons: []
        }
    });

    const {register, handleSubmit, reset, control, setValue, watch, formState: {errors}} = formMethods;

    const syllabusId = watch('syllabusId');
    const watchLessons = watch('lessons');

    const {fields, append, remove, replace} = useFieldArray({
        control,
        name: "lessons"
    });

    useEffect(() => {
        console.log("Current form fields:", fields);
        console.log("Current form values - lessons:", watchLessons);
    }, [fields, watchLessons]);

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                setLoading(true);
                const response = await getAllLessons();
                const lessonData = response.data ? response.data : response;
                setAllLessons(Array.isArray(lessonData) ? lessonData : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching lessons:', error);
                enqueueSnackbar('Failed to load lessons: ' + (error?.response?.data?.message || error.message), {
                    variant: 'error'
                });
                setAllLessons([]);
                setLoading(false);
            }
        };
        fetchLessons();
    }, []);

    useEffect(() => {
        if (isEdit && syllabus) {
            console.log("Setting up edit mode with syllabus:", syllabus);

            lessonsProcessedRef.current = false;

            try {
                if (syllabus.lessons && Array.isArray(syllabus.lessons)) {
                    console.log("Found lessons:", syllabus.lessons);

                    // Map syllabus lessons to the correct format
                    const mappedLessons = syllabus.lessons.map(lesson => ({
                        id: lesson.id,
                        syllabusId: syllabus.id,
                        description: lesson.description || ""
                    }));

                    reset({
                        syllabusId: syllabus.id,
                        title: syllabus.title || '',
                        description: syllabus.description || '',
                        lessons: mappedLessons
                    });

                    replace(mappedLessons);

                    lessonsProcessedRef.current = true;
                } else {
                    reset({
                        syllabusId: syllabus.id,
                        title: syllabus.title || '',
                        description: syllabus.description || '',
                        lessons: []
                    });
                    console.warn("No lessons found or it's not an array:", syllabus.lessons);
                }
            } catch (error) {
                console.error("Error processing syllabus lessons:", error);
                enqueueSnackbar('Error loading syllabus lessons', {variant: 'error'});
            }
        } else if (!isEdit) {
            reset({
                syllabusId: null,
                title: '',
                description: '',
                lessons: []
            });
        }
    }, [syllabus, isEdit, reset, replace]);

    const safeAppend = useCallback(() => {
        if (addingLesson) return;

        try {
            setAddingLesson(true);

            append({
                id: "", // This will be set to lesson ID when user selects
                syllabusId: syllabusId || null,
                description: ""
            });

            setTimeout(() => setAddingLesson(false), 100);
        } catch (error) {
            console.error("Error adding lesson:", error);
            setAddingLesson(false);
        }
    }, [append, addingLesson, syllabusId]);

    useEffect(() => {
        if (syllabusId && fields.length > 0) {
            fields.forEach((_, index) => {
                setValue(`lessons.${index}.syllabusId`, Number(syllabusId));
            });
        }
    }, [syllabusId, fields, setValue]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            let response;

            const formattedData = {
                ...data,
                syllabusId: data.syllabusId ? Number(data.syllabusId) : null,
                lessons: data.lessons.map(lesson => ({
                    lessonId: lesson.id,
                    syllabusId: Number(data.syllabusId) || null,
                    description: lesson.description || ""
                }))
            };

            console.log("Submitting data:", formattedData);

            if (isEdit && syllabus) {
                formattedData.syllabusId = Number(syllabus.id);
                response = await updateSyllabus(syllabus.id, formattedData);
                enqueueSnackbar('Syllabus updated successfully!', {variant: 'success'});
            } else {
                response = await createSyllabus(formattedData);
                if (!response.data) {
                    enqueueSnackbar("Syllabus already exists!", {variant: 'error'});
                    setLoading(false);
                    return;
                }
                enqueueSnackbar("Syllabus added successfully!", {variant: 'success'});
            }

            setLoading(false);
            reset();
            onClose();
        } catch (error) {
            console.error('Operation failed:', error);
            enqueueSnackbar(
                isEdit
                    ? 'Failed to update syllabus: ' + (error?.response?.data?.message || error.message)
                    : 'Syllabus addition failed: ' + (error?.response?.data?.message || error.message),
                {variant: 'error'}
            );
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? 'Edit Syllabus' : 'Add Syllabus'}</DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{mt: 1}}>
                    <input type="hidden" {...register("syllabusId")} />

                    <TextField
                        label="Syllabus Title"
                        fullWidth
                        margin="normal"
                        error={!!errors.title}
                        helperText={errors.title ? "Title is required" : ""}
                        {...register("title", {required: true})}
                        autoFocus
                        disabled={loading}
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        margin="normal"
                        error={!!errors.description}
                        helperText={errors.description ? "Description is required" : ""}
                        {...register("description", {required: true})}
                        disabled={loading}
                    />
                    <Typography variant="subtitle1" mt={2}>Lessons</Typography>

                    {isEdit && syllabus?.lessons?.length > 0 && fields.length === 0 && (
                        <Typography color="error" variant="body2">
                            Found {syllabus.lessons.length} lessons but not displayed. Check console for
                            details.
                        </Typography>
                    )}

                    {fields.map((item, index) => (
                        <LessonItem
                            key={item.id}
                            item={item}
                            index={index}
                            control={control}
                            register={register}
                            remove={remove}
                            allLessons={allLessons}
                            errors={errors}
                            loading={loading}
                            watch={watch}
                        />
                    ))}
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={safeAppend}
                        sx={{mb: 2}}
                        startIcon={<Add color="secondary"/>}
                        disabled={loading || addingLesson}
                    >
                        Add Lesson
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary" disabled={loading}>
                    Close
                </Button>
                <Button 
                    onClick={handleSubmit(onSubmit)} 
                    variant="contained" 
                    color="success" 
                    disabled={loading}
                >
                    {isEdit ? 'Update Syllabus' : 'Add Syllabus'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
