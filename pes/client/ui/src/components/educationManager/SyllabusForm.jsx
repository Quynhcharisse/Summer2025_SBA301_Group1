import {memo, useCallback, useEffect, useRef, useState} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
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
import {createSyllabus, getAllSyllabi, updateSyllabus} from "../../services/EducationService.jsx";

const LessonItem = memo(({
                             item,
                             index,
                             register,
                             remove,
                             allLessons,
                             errors,
                             loading
                         }) => {
    return (
        <Box key={item.id} sx={{border: 1, borderRadius: 1, p: 2, mb: 2}}>
            <FormControl fullWidth margin="dense" error={!!errors?.lessons?.[index]?.lessonId}>
                <InputLabel id={`lesson-select-label-${index}`}>Lesson</InputLabel>
                <Select
                    labelId={`lesson-select-label-${index}`}
                    label="Lesson"
                    defaultValue={item.lessonId || ""}
                    {...register(`lessons.${index}.lessonId`, {required: true})}
                    disabled={loading}
                >
                    <MenuItem value="">
                        <em>Select Lesson</em>
                    </MenuItem>
                    {allLessons && Array.isArray(allLessons) && allLessons.map(lesson =>
                        lesson && lesson.id ? (
                            <MenuItem key={lesson.id} value={Number(lesson.id)}>
                                {lesson.topic || lesson.title || `Lesson #${lesson.id}`}
                            </MenuItem>
                        ) : null
                    )}
                </Select>
                {errors?.lessons?.[index]?.lessonId && <FormHelperText>Lesson selection is required</FormHelperText>}
            </FormControl>

            {/* Hidden field for syllabusId in each lesson */}
            <input type="hidden" {...register(`lessons.${index}.syllabusId`)} />

            {allLessons && item.lessonId && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {allLessons.find(l => Number(l.id) === Number(item.lessonId))?.description || ''}
                </Typography>
            )}

            <Divider sx={{my: 2}}/>

            <TextField
                label="Note"
                fullWidth
                margin="normal"
                multiline
                rows={2}
                placeholder="Add notes about this lesson (optional)"
                defaultValue={item.note || ""}
                {...register(`lessons.${index}.note`)}
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
                const response = await getAllSyllabi();
                // Ensure we're getting data in the right format
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
                if (syllabus.syllabusLessonList && Array.isArray(syllabus.syllabusLessonList)) {
                    console.log("Found syllabusLessonList:", syllabus.syllabusLessonList);

                    const lessonFormData = syllabus.syllabusLessonList
                        .filter(syllabusLesson => syllabusLesson && syllabusLesson.lesson)
                        .map(syllabusLesson => ({
                            lessonId: Number(syllabusLesson.lesson.id),
                            syllabusId: Number(syllabus.id),
                            note: syllabusLesson.note || ''
                        }));

                    console.log("Processed lesson data for form:", lessonFormData);

                    reset({
                        syllabusId: syllabus.id,
                        title: syllabus.title || '',
                        description: syllabus.description || '',
                        lessons: lessonFormData // Include lessons directly in reset
                    });

                    replace(lessonFormData);

                    lessonsProcessedRef.current = true;
                } else {
                    reset({
                        syllabusId: syllabus.id,
                        title: syllabus.title || '',
                        description: syllabus.description || '',
                        lessons: []
                    });
                    console.warn("No syllabusLessonList found or it's not an array:", syllabus.syllabusLessonList);
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
                lessonId: "",
                syllabusId: syllabusId || null,
                note: ""
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
                    ...lesson,
                    lessonId: Number(lesson.lessonId),
                    syllabusId: Number(data.syllabusId) || null
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
                        margin="normal"
                        error={!!errors.description}
                        helperText={errors.description ? "Description is required" : ""}
                        {...register("description", {required: true})}
                        disabled={loading}
                    />
                    <Typography variant="subtitle1" mt={2}>Lessons</Typography>

                    {isEdit && syllabus?.syllabusLessonList?.length > 0 && fields.length === 0 && (
                        <Typography color="error" variant="body2">
                            Found {syllabus.syllabusLessonList.length} lessons but not displayed. Check console for
                            details.
                        </Typography>
                    )}

                    {fields.map((item, index) => (
                        <LessonItem
                            key={item.id}
                            item={item}
                            index={index}
                            register={register}
                            remove={remove}
                            allLessons={allLessons}
                            errors={errors}
                            loading={loading}
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
                    <DialogActions>
                        <Button onClick={onClose} color="secondary" disabled={loading}>
                            Close
                        </Button>
                        <Button type="submit" variant="contained" color="success" disabled={loading}>
                            {isEdit ? 'Update Syllabus' : 'Add Syllabus'}
                        </Button>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
