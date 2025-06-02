import '../../styles/home/AboutUs.css'


export default function AboutUs() {
    return (
        <div className="about-us-section" id="about">
            <div className="about-us-container">
                {/* Tiêu đề + icon ngôi sao */}
                <div className="about-title-wrapper">
                    <h2 className="about-title">VỀ CHÚNG TÔI</h2>
                </div>

                <p className="about-subtitle">MerryStar – Mầm non song ngữ cho khởi đầu vững chắc</p>

                {/* Nội dung chính */}
                <div className="about-text">
                    <p>
                        MerryStar Kindergarten được hình thành từ trăn trở của những nhà giáo dục dành hết tâm huyết cho
                        giáo dục Mầm non – “độ tuổi vàng” hình thành nền móng, tạo ra nhân sinh quan đầu tiên cho cả
                        cuộc đời của một người trưởng thành.
                    </p>
                    <p>
                        Mỗi em bé sinh ra đã là “một kỳ quan cuộc sống”, mang những tố chất của một cá nhân tuyệt vời và
                        luôn hạnh phúc. Vì vậy, nhiệm vụ của giáo dục mầm non là tạo ra sự phát triển cân bằng, giúp trẻ
                        phát huy tối đa năng lực: thể chất, tâm hồn, trí tuệ – những giá trị cốt lõi của hạnh phúc và
                        thành công trong tương lai.
                    </p>
                    <p>
                        Những nhà sáng lập của MerryStar Kindergarten – những người đã từng là nhà lãnh đạo, dẫn dắt và
                        trải nghiệm các chương trình, phương pháp giáo dục mầm non tiên tiến trên thế giới như Reggio
                        Emilia, Montessori, IPC… tại những hệ thống giáo dục mầm non uy tín nhất tại Việt Nam và thế
                        giới đã đúc kết những tư tưởng giáo dục tiên phong trên thế giới và lựa chọn triết lý Thân – Tâm
                        – Tuệ chính là giá trị cốt lõi để đem lại hạnh phúc và thành công của mỗi con người.
                    </p>
                </div>

                {/* TẦM NHÌN */}
                <div className="about-block">
                    <div className="about-text-side">
                        <h3 className="about-heading">TẦM NHÌN</h3>
                        <div className="heading-underline"></div>
                        <p>
                            Hệ thống Mầm non Song ngữ MerryStar định hướng trở thành tổ chức giáo dục mầm non —
                            Nơi mỗi con trẻ là Trái tim lan tỏa hạnh phúc cho toàn gia đình,
                            từ đó trở thành “nơi lan tỏa hạnh phúc” cho xã hội.
                        </p>
                    </div>
                    <div className="about-image-side">
                        <img src="	https://merrystar.edu.vn/wp-content/uploads/2021/10/Mam-non-song-ngu-merrystar-ve-chung-toi-2.png" alt="Tầm nhìn"/>
                    </div>
                </div>

                {/* SỨ MỆNH */}
                <div className="about-block reverse">
                    <div className="about-text-side">
                        <h3 className="about-heading">SỨ MỆNH</h3>
                        <div className="heading-underline"></div>
                        <p>
                            Sứ mệnh của chúng tôi là nuôi dưỡng thế hệ trẻ em hạnh phúc và thành công trong tương lai
                            với triết lý giáo dục Thân – Tâm – Tuệ.
                        </p>
                    </div>
                    <div className="about-image-side">
                        <img src="	https://merrystar.edu.vn/wp-content/uploads/2021/10/Mam-non-song-ngu-merrystar-ve-chung-toi-1.png" alt="Sứ mệnh"/>
                    </div>
                </div>

                {/* Giá trị cốt lõi */}
                <div className="about-core-values">
                    <div className="core-value-item core-blue">
                        <img src="https://merrystar.edu.vn/wp-content/uploads/2021/10/Mam-non-song-ngu-merrystar-chan-dung-hoc-sinh-1-1.png" alt="Thân icon" />
                        <h4>Thân</h4>
                        <p>
                            Học sinh MerryStar Khỏe mạnh – Kháng bệnh tốt – Tràn đầy năng lượng.
                        </p>
                    </div>

                    <div className="core-value-item core-pink">
                        <img src="https://merrystar.edu.vn/wp-content/uploads/2021/10/Mam-non-song-ngu-merrystar-chan-dung-hoc-sinh-2.png" alt="Tâm icon" />
                        <h4>Tâm</h4>
                        <p>
                            Học sinh MerryStar biết yêu thương và lan tỏa tình yêu thương với những biểu hiện cụ thể.
                        </p>
                    </div>

                    <div className="core-value-item core-yellow">
                        <img src="https://merrystar.edu.vn/wp-content/uploads/2021/10/Mam-non-song-ngu-merrystar-chan-dung-hoc-sinh-3.png" alt="Tuệ icon" />
                        <h4>Tuệ</h4>
                        <p>
                            Học sinh MerryStar làm chủ ngôn ngữ tiếng Anh và tiếng Việt, có tư duy lựa chọn độc lập và sáng tạo để thành công.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
