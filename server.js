const express = require('express');
const wol = require('wakeonlan');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// รายชื่อคอมพิวเตอร์ในร้าน (เปลี่ยน MAC Address ให้ตรงกับเครื่องจริง)
const computerList = {
    "PC01": "AA:BB:CC:DD:EE:01",
    "PC02": "AA:BB:CC:DD:EE:02",
    "PC03": "AA:BB:CC:DD:EE:03"
};

// API สำหรับสั่งเปิดคอม
app.post('/api/wakeup', (req, res) => {
    const { pcName } = req.body;
    const macAddress = computerList[pcName];

    if (!macAddress) {
        return res.status(400).json({ success: false, message: "ไม่พบชื่อคอมพิวเตอร์เครื่องนี้" });
    }

    // ส่งสัญญาณ Wake-on-LAN
    wol(macAddress).then(() => {
        console.log(`[WOL] ส่งสัญญาณเปิดเครื่อง ${pcName} (${macAddress}) แล้ว`);
        res.json({ success: true, message: `ส่งสัญญาณเปิดเครื่อง ${pcName} สำเร็จ!` });
    }).catch((err) => {
        console.error(err);
        res.status(500).json({ success: false, message: "เกิดข้อผิดพลาดในการส่งสัญญาณ" });
    });
});

// API สำหรับส่งข้อความหาแอดมิน
app.post('/api/contact-admin', (req, res) => {
    const { pcNumber, message } = req.body;
    
    // ในความเป็นจริง ตรงนี้สามารถต่อยอดให้ส่งไลน์ (Line Notify) หรือเด้งเข้าบอท Discord ได้
    console.log(`📩 [ข้อความจากเครื่อง ${pcNumber}]: ${message}`);
    
    res.json({ success: true, message: "ส่งข้อความถึงแอดมินแล้ว!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
