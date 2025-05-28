import "../styles/Home.css"
import {Button, Menu, MenuItem} from "@mui/material";
import {KeyboardArrowDown} from '@mui/icons-material';
import {Carousel} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function RenderDropdown({index, item, closeFunc, open, openDropdownFunc, anchorEl, listOptions}) {
    return (
        <div key={index}>
            <Button endIcon={<KeyboardArrowDown/>} onClick={(e) => openDropdownFunc(e, item.id)}>{item.title}</Button>
            <Menu
                open={open}
                onClose={closeFunc}
                anchorEl={anchorEl}
            >
                {listOptions.map((option, index) => (
                    <MenuItem key={index} onClick={closeFunc}>{option}</MenuItem>
                ))}
            </Menu>
        </div>
    )
}

function RenderHeader() {
    const navigate = useNavigate();
    const [dropDownBtn, setDropDownBtn] = useState(
        [
            {id: 1, title: "giới thiệu", open: false, anchor: null, options: ["Option 1", "Option 2"]},
            {id: 2, title: "đội ngũ", open: false, anchor: null, options: ["Option 1", "Option 2"]},
            {id: 3, title: "chương trình giáo dục", open: false, anchor: null, options: ["Option 1", "Option 2"]},
            {id: 4, title: "tuyển sinh", open: false, anchor: null, options: ["Option 1", "Option 2"]},
            {id: 5, title: "chăm sóc - kết nối", open: false, anchor: null, options: ["Option 1", "Option 2"]},
            {id: 6, title: "tin tức - sự kiện", open: false, anchor: null, options: ["Option 1", "Option 2"]},
            {id: 7, title: "liên hệ", open: false, anchor: null, options: ["Option 1", "Option 2"]}
        ]
    )

    const handleOpenDropdown = (e, id) => {
        setDropDownBtn(prev =>
            prev.map(item =>
                item.id === id ? {...item, open: true, anchor: e.currentTarget} : {...item, open: false, anchor: null}
            )
        )
    }

    const handleCloseDropdown = () => {
        setDropDownBtn(prev =>
            prev.map(item => ({...item, open: false, anchor: null})
            )
        )
    }

    return (
        <div className="header">
            <img fetchpriority="high" width="200" height="70"
                 src="https://merrystar.edu.vn/wp-content/uploads/2021/09/logo-merrystar-horizontal.png" alt=""
                 srcSet="https://merrystar.edu.vn/wp-content/uploads/2021/09/logo-merrystar-horizontal.png 903w, https://merrystar.edu.vn/wp-content/uploads/2021/09/logo-merrystar-horizontal-300x113.png 300w, https://merrystar.edu.vn/wp-content/uploads/2021/09/logo-merrystar-horizontal-768x289.png 768w"
                 sizes="(max-width: 100vw) 100vw, 903px"/>
            <div className={"dropdown-area"}>
                {dropDownBtn.map(item => (
                    <RenderDropdown
                        key={item.id}
                        item={item}
                        openDropdownFunc={handleOpenDropdown}
                        closeFunc={handleCloseDropdown}
                        open={item.open}
                        anchorEl={item.anchor}
                        listOptions={item.options}
                    />
                ))}
            </div>

            <div className="button-action">
                <Button variant={"contained"} className={"btn"} onClick={() => navigate("/login")}>Đăng nhập</Button>
                <Button variant={"contained"} className={"btn"}>Đăng kí</Button>
            </div>
        </div>
    )
}

function RenderCarousel() {
    return (
        <div className="carousel">
            <Carousel>
                <Carousel.Item>
                    <img
                        decoding="async"
                        src="https://merrystar.edu.vn/wp-content/uploads/2022/02/Mam-non-song-ngu-Merrystar-2022-3-1.jpg"
                        alt="Mam-non-song-ngu-Merrystar-2022 (3)"
                        loading="lazy"
                        data-default="https://merrystar.edu.vn/wp-content/uploads/2022/02/Mam-non-song-ngu-Merrystar-2022-3-1.jpg"/>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        decoding="async"
                        src="https://merrystar.edu.vn/wp-content/uploads/2022/03/Mam-non-song-ngu-Merrystar-2022-banner-1.jpg"
                        alt="Mam-non-song-ngu-Merrystar-2022-banner (1)"
                        loading="lazy"
                        data-default="https://merrystar.edu.vn/wp-content/uploads/2022/03/Mam-non-song-ngu-Merrystar-2022-banner-1.jpg"/>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        decoding="async"
                        src="https://merrystar.edu.vn/wp-content/uploads/2022/09/merrystar-bo-gddt-toi-tham-1.jpg"
                        alt="merrystar-bo-gddt-toi-tham (1)"
                        loading="lazy"
                        data-default="https://merrystar.edu.vn/wp-content/uploads/2022/09/merrystar-bo-gddt-toi-tham-1.jpg"/>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

function RenderFooter() {
    return (
        <div className="footer">
            <h1>Footer</h1>
        </div>
    )
}

function RenderHome() {
    return (
        <div className="container">
            <RenderHeader/>
            <RenderCarousel/>
            <RenderFooter/>
        </div>
    )
}

export function Home() {
    return (
        <div className="main">
            <RenderHome/>
        </div>
    )
}