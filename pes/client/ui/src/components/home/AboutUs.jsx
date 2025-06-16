import '../../styles/home/AboutUs.css'

export default function AboutUs() {
    return (
        <div className="about-us-section" id="about">
            <div className="about-us-container">
                {/* Title + star icon */}
                <div className="about-title-wrapper">
                    <h2 className="about-title">ABOUT US</h2>
                </div>

                <p className="about-subtitle">MerryStar – A bilingual kindergarten for a strong foundation</p>

                {/* Main content */}
                <div className="about-text">
                    <p>
                        MerryStar Kindergarten was born from the deep concern of educators who dedicate their hearts to
                        Early Childhood Education — the "golden age" for laying the foundation and forming the first
                        worldview for a future adult.
                    </p>
                    <p>
                        Every child is a "wonder of life," possessing the qualities of a wonderful individual and
                        naturally happy. Therefore, early childhood education must create balanced development, helping
                        children maximize their potential in physical, emotional, and intellectual domains — the core
                        values of future happiness and success.
                    </p>
                    <p>
                        The founders of MerryStar Kindergarten — leaders who have guided and experienced advanced early
                        education philosophies such as Reggio Emilia, Montessori, IPC... in prestigious preschool
                        systems in Vietnam and around the world — have distilled pioneering educational ideologies and
                        chosen the philosophy of Body – Mind – Wisdom as the core value to bring happiness and success
                        to every individual.
                    </p>
                </div>

                {/* Vision */}
                <div className="about-block">
                    <div className="about-text-side">
                        <h3 className="about-heading">VISION</h3>
                        <div className="heading-underline"></div>
                        <p>
                            MerryStar Bilingual Kindergarten aims to become a preschool education organization —
                            A place where every child is the heart that spreads happiness to the whole family,
                            thus becoming a "happiness spreading center" for society.
                        </p>
                    </div>
                    <div className="about-image-side">
                        <img src="/487216724_970330175277156_3252495190011527878_n.jpg" alt="Vision"/>
                    </div>
                </div>

                {/* Mission */}
                <div className="about-block reverse">
                    <div className="about-text-side">
                        <h3 className="about-heading">MISSION</h3>
                        <div className="heading-underline"></div>
                        <p>
                            Our mission is to nurture a future generation of happy and successful children through the
                            educational philosophy of Body – Mind – Wisdom.
                        </p>
                    </div>
                    <div className="about-image-side">
                        <img src="/486791182_970330155277158_3848753021387074753_n.jpg" alt="Mission"/>
                    </div>
                </div>

                {/* Core Values */}
                <div className="about-core-values">
                    <div className="core-value-item core-blue">
                        <img src="/486637140_968708965439277_3585836273710347498_n.jpg" alt="Body icon"/>
                        <h4>Body</h4>
                        <p>
                            MerryStar students are healthy – resilient – full of energy.
                        </p>
                    </div>

                    <div className="core-value-item core-pink">
                        <img src="/487207558_968708952105945_5733640689784949425_n.jpg" alt="Mind icon"/>
                        <h4>Mind</h4>
                        <p>
                            MerryStar students know how to love and spread love through meaningful actions.
                        </p>
                    </div>

                    <div className="core-value-item core-yellow">
                        <img src="/486159745_967920775518096_5981093204083660212_n.jpg" alt="Wisdom icon"/>
                        <h4>Wisdom</h4>
                        <p>
                            MerryStar students master both English and Vietnamese, with independent and creative
                            thinking to achieve success.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}