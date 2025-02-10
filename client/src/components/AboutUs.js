import React from "react";
import { FaGlobe, FaHistory, FaBalanceScale, FaBriefcase } from "react-icons/fa"; // ✅ Import icons

const AboutUs = () => {
    const styles = {
        container: {
            display: "grid",
            gridTemplateColumns: "1fr 1fr", // ✅ Two-column layout
            gap: "30px",
            maxWidth: "900px",
            margin: "50px auto",
            padding: "20px",
            fontFamily: "'Arial', sans-serif",
        },
        section: {
            display: "flex",
            alignItems: "flex-start",
            gap: "15px",
            backgroundColor: "#f9f9f9",
            padding: "15px",
            borderRadius: "10px",
        },
        icon: {
            fontSize: "32px",
            color: "#2e856e", // ✅ Icon color
        },
        textContainer: {
            textAlign: "left",
        },
        title: {
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1e3a34",
            marginBottom: "5px",
        },
        text: {
            fontSize: "16px",
            color: "#444",
            lineHeight: "1.5",
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.section}>
                <FaGlobe style={styles.icon} />
                <div style={styles.textContainer}>
                    <h3 style={styles.title}>ABOUT US</h3>
                    <p style={styles.text}>
                        We are a social impact company that dreams of a planet with no food waste.
                    </p>
                </div>
            </div>

            <div style={styles.section}>
                <FaBalanceScale style={styles.icon} />
                <div style={styles.textContainer}>
                    <h3 style={styles.title}>ESG</h3>
                    <p style={styles.text}>
                        As a mission-driven company, we care about what we do and how we do it.
                    </p>
                </div>
            </div>

            <div style={styles.section}>
                <FaHistory style={styles.icon} />
                <div style={styles.textContainer}>
                    <h3 style={styles.title}>OUR HISTORY</h3>
                    <p style={styles.text}>
                        Sustainable Bao was founded to help people reduce food waste and track their impact.
                    </p>
                </div>
            </div>

            <div style={styles.section}>
                <FaBriefcase style={styles.icon} />
                <div style={styles.textContainer}>
                    <h3 style={styles.title}>CAREERS</h3>
                    <p style={styles.text}>
                        Discover our open positions and apply to work with us on making a difference.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
