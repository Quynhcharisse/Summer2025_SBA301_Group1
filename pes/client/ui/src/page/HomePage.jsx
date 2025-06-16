import "../styles/home/Home.css"
import {Button, Menu, MenuItem} from "@mui/material";
import {KeyboardArrowDown} from '@mui/icons-material';
import {Carousel} from "react-bootstrap";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import AboutUs from "../components/home/AboutUs.jsx";

function RenderDropdown({ index, item, closeFunc, open, openDropdownFunc, anchorEl, listOptions }) {
    const handleClick = (e) => {
        if (listOptions.length > 0) {
            openDropdownFunc(e, item.id);
        } else {
            if (item.title.toLowerCase() === "giới thiệu") {
                const aboutSection = document.getElementById("about");
                if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                }
            }
            // có thể thêm các điều kiện khác sau này cho "liên hệ", "đội ngũ", v.v.
        }
    };

    return (
        <div key={index}>
            <Button endIcon={listOptions.length > 0 ? <KeyboardArrowDown /> : null} onClick={handleClick}>
                {item.title}
            </Button>
            {listOptions.length > 0 && (
                <Menu open={open} onClose={closeFunc} anchorEl={anchorEl}>
                    {listOptions.map((option, idx) => (
                        <MenuItem key={idx} onClick={closeFunc}>{option}</MenuItem>
                    ))}
                </Menu>
            )}
        </div>
    );
}

function RenderHeader() {
    const navigate = useNavigate();
    const [dropDownBtn, setDropDownBtn] = useState(
        [
            {id: 1, title: "giới thiệu", open: false, anchor: null, options: []},
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
            <img fetchPriority="high" width="200" height="70"
                 src='/logo-merrystar-horizontal.png' alt=""
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
                        src="/487740107_975051634805010_8611635320830059307_n.jpg"
                        alt="Mam-non-song-ngu-Merrystar-2022 (3)"
                        loading="lazy"
                        data-default="https://merrystar.edu.vn/wp-content/uploads/2022/02/Mam-non-song-ngu-Merrystar-2022-3-1.jpg"/>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        decoding="async"
                        src="/488220712_975051164805057_4560363873878312652_n.jpg"
                        alt="Mam-non-song-ngu-Merrystar-2022-banner (1)"
                        loading="lazy"
                        data-default="https://merrystar.edu.vn/wp-content/uploads/2022/03/Mam-non-song-ngu-Merrystar-2022-banner-1.jpg"/>
                </Carousel.Item>
                <Carousel.Item>
                    <img
                        decoding="async"
                        src="/487870127_975051254805048_6838321561132019387_n.jpg"
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
            <div className="footer-container">
                {/* Phần bên trái */}
                <div className="footer-left">
                    <img className="logo"
                         src="/logo-merrystar-horizontal.png"
                         alt="MerryStar Logo"/>
                    <p className="school-name">MẦM NON SONG NGỮ MERRYSTAR</p>
                    <div className="languages">
                        <div className="lang-item">
                            <img
                                src="data:image/svg+xml;utf8,%3Csvg width='21' height='15' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='50%' y1='0%' x2='50%' y2='100%' id='a'%3E%3Cstop stop-color='%23FFF' offset='0%'/%3E%3Cstop stop-color='%23F0F0F0' offset='100%'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%' y1='0%' x2='50%' y2='100%' id='b'%3E%3Cstop stop-color='%23EA403F' offset='0%'/%3E%3Cstop stop-color='%23D82827' offset='100%'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%' y1='0%' x2='50%' y2='100%' id='c'%3E%3Cstop stop-color='%23FFFE4E' offset='0%'/%3E%3Cstop stop-color='%23FFFE38' offset='100%'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='url(%23a)' d='M0 0h21v15H0z'/%3E%3Cpath fill='url(%23b)' d='M0 0h21v15H0z'/%3E%3Cpath fill='url(%23c)' d='M10.5 9.255l-2.645 1.886.976-3.099L6.22 6.11l3.247-.029L10.5 3l1.032 3.08 3.248.03-2.61 1.932.975 3.099z'/%3E%3C/g%3E%3C/svg%3E"
                                alt="Vietnam flag" width="21" height="15"/>
                            <span>VI</span>
                        </div>
                        <div className="lang-item">
                            <img
                                src="data:image/svg+xml;utf8,%3Csvg width='21' height='15' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient x1='50%' y1='0%' x2='50%' y2='100%' id='a'%3E%3Cstop stop-color='%23FFF' offset='0%'/%3E%3Cstop stop-color='%23F0F0F0' offset='100%'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%' y1='0%' x2='50%' y2='100%' id='b'%3E%3Cstop stop-color='%230A17A7' offset='0%'/%3E%3Cstop stop-color='%23030E88' offset='100%'/%3E%3C/linearGradient%3E%3ClinearGradient x1='50%' y1='0%' x2='50%' y2='100%' id='c'%3E%3Cstop stop-color='%23E6273E' offset='0%'/%3E%3Cstop stop-color='%23CF152B' offset='100%'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath fill='url(%23a)' d='M0 0h21v15H0z'/%3E%3Cpath fill='url(%23b)' d='M-.002 0h21v15h-21z'/%3E%3Cpath d='M5.003 10H-.002V5h5.005L-2.082.22l1.118-1.657 8.962 6.045V-1h5v5.608l8.962-6.045L23.078.22 15.993 5h5.005v5h-5.005l7.085 4.78-1.118 1.657-8.962-6.045V16h-5v-5.608l-8.962 6.045-1.118-1.658L5.003 10z' fill='url(%23a)'/%3E%3Cpath d='M14.136 4.958l9.5-6.25a.25.25 0 00-.275-.417l-9.5 6.25a.25.25 0 10.275.417zm.732 5.522l8.515 5.74a.25.25 0 10.28-.415l-8.516-5.74a.25.25 0 00-.279.415zM6.142 4.526L-2.74-1.461a.25.25 0 00-.28.415L5.863 4.94a.25.25 0 00.279-.414zm.685 5.469l-9.845 6.53a.25.25 0 10.276.416l9.846-6.529a.25.25 0 00-.277-.417z' fill='%23DB1F35' fill-rule='nonzero'/%3E%3Cpath fill='url(%23c)' d='M-.002 9h9v6h3V9h9V6h-9V0h-3v6h-9z'/%3E%3C/g%3E%3C/svg%3E"
                                alt="UK flag" width="21" height="15"/>
                            <span>EN</span>
                        </div>
                    </div>
                </div>

                {/* Phần ở giữa */}
                <div className="footer-middle">
                    <h3>Liên hệ</h3>

                    <div className="contact-item">
                        <span className="icon">📞</span>
                        <span>093 168 3999</span>
                    </div>

                    <div className="contact-item">
                        <span className="icon">📧</span>
                        <span>contact@merrystar.edu.vn</span>
                    </div>

                    <div className="contact-item">
                        <span className="icon">📍</span>
                        <span>Tulip 09-38 & 40, Khu đô thị Vinhomes Riverside<br/>Phường Việt Hưng, Quận Long Biên, TP. Hà Nội</span>
                    </div>
                </div>

                {/* Phần ở bên phải */}
                <div className="footer-right">
                    <h3>Liên kết nhanh</h3>
                    <ul>
                        <li><a href="#">Về MerryStar Kindergarten</a></li>
                        <li><a href="#">Triết lý giáo dục</a></li>
                        <li><a href="#">Quy chế tuyển sinh</a></li>
                        <li><a href="#">Sổ tay Phụ huynh</a></li>
                        <li><a href="#">Cha Mẹ Thông Thái</a></li>
                        <li><a href="#">Câu hỏi thường gặp</a></li>
                        <li><a href="#">Chính sách bảo mật & Điều khoản</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>Copyright © 2021 MerryStar all rights reserved.</p>
            </div>
        </div>
    )
}

function RenderHome() {
    return (
        <div className="container">
            <RenderHeader/>
            <RenderCarousel/>
            <AboutUs/>
            <RenderFooter/>
        </div>
    )
}

export function HomePage() {
    return (
        <div className="main">
            <RenderHome/>
        </div>
    )
}