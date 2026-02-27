// Smart Healthcare Appointment & Patient Monitor System
// Pure JavaScript: async, closures, and simulated API.

// ---------------------------------------------------------------------------
// 1. Simulated async "API" using closures
// ---------------------------------------------------------------------------
const FakeAPI = (function () {
  // Private in-memory DB
  let doctors = [
    { id: 1, name: "Dr. Priya Rao", specialty: "Cardiologist" },
    { id: 2, name: "Dr. Arjun Singh", specialty: "Endocrinologist" },
    { id: 3, name: "Dr. Kavya Iyer", specialty: "General Physician" }
  ];

  let appointmentIdCounter = 1;
  let appointments = [];

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return {
    async fetchDoctors() {
      await delay(500);
      return [...doctors];
    },

    async createAppointment({ doctorId, patientId, time, reason }) {
      await delay(350);

      const doc = doctors.find(d => d.id === Number(doctorId));
      if (!doc) {
        throw new Error("Doctor not found");
      }

      const appt = {
        id: appointmentIdCounter++,
        doctorId: doc.id,
        doctorName: doc.name,
        patientId,
        time,
        reason,
        status: "BOOKED"
      };
      appointments.push(appt);
      return { ...appt };
    },

    async listAppointmentsByPatient(patientId) {
      await delay(300);
      return appointments
        .filter(a => a.patientId === Number(patientId))
        .map(a => ({ ...a }));
    }
  };
})();

// ---------------------------------------------------------------------------
// 2. Patient record: closure for private data
// ---------------------------------------------------------------------------
function createPatientRecord({ id, name, age, heightCm, weightKg }) {
  // Private state
  let vitals = []; // { type, value, timestamp }

  function addVital({ type, value, timestamp = new Date() }) {
    // Normalize value: numbers where possible
    const numericValue = isNaN(Number(value)) ? value : Number(value);
    vitals.push({ type, value: numericValue, timestamp });
  }

  function calculateBMI() {
    const h = Number(heightCm) / 100;
    const w = Number(weightKg);
    if (!h || !w) return null;
    return Number((w / (h * h)).toFixed(2));
  }

  function getAverageHeartRate() {
    const hr = vitals.filter(v => v.type === "HR" && typeof v.value === "number");
    if (!hr.length) return null;
    const sum = hr.reduce((acc, v) => acc + v.value, 0);
    return Number((sum / hr.length).toFixed(1));
  }

  function getLastSpO2() {
    const spo2 = vitals.filter(v => v.type === "SPO2" && typeof v.value === "number");
    if (!spo2.length) return null;
    return spo2[spo2.length - 1].value;
  }

  function getPublicVitalsSnapshot() {
    // For debugging if needed, but vitals array remains private
    return vitals.slice(-10);
  }

  return {
    getId() {
      return id;
    },
    getName() {
      return name;
    },
    updateProfile({ name: newName, age: newAge, heightCm: h, weightKg: w }) {
      if (newName) name = newName;
      if (newAge != null) age = Number(newAge);
      if (h != null) heightCm = Number(h);
      if (w != null) weightKg = Number(w);
    },
    getSummary() {
      return {
        id,
        name,
        age,
        heightCm,
        weightKg,
        bmi: calculateBMI(),
        avgHeartRate: getAverageHeartRate(),
        lastSpO2: getLastSpO2()
      };
    },
    addVital,
    calculateBMI,
    getAverageHeartRate,
    getLastSpO2,
    _debug_getVitals: getPublicVitalsSnapshot // still not raw reference
  };
}

// ---------------------------------------------------------------------------
// 3. SmartHealthcareSystem orchestrator
// ---------------------------------------------------------------------------
function createSmartHealthcareSystem() {
  const patients = new Map(); // patientId -> record

  async function loadDoctors() {
    return FakeAPI.fetchDoctors();
  }

  function registerOrUpdatePatient({ id, name, age, heightCm, weightKg }) {
    id = Number(id);
    age = Number(age);
    heightCm = Number(heightCm);
    weightKg = Number(weightKg);

    if (patients.has(id)) {
      const existing = patients.get(id);
      existing.updateProfile({ name, age, heightCm, weightKg });
      return existing;
    }

    const record = createPatientRecord({ id, name, age, heightCm, weightKg });
    patients.set(id, record);
    return record;
  }

  function getPatientRecord(patientId) {
    const record = patients.get(Number(patientId));
    if (!record) throw new Error("Patient not found");
    return record;
  }

  async function bookAppointment({ doctorId, patientId, time, reason }) {
    if (!patients.has(Number(patientId))) {
      throw new Error("Patient must be registered");
    }
    return FakeAPI.createAppointment({
      doctorId: Number(doctorId),
      patientId: Number(patientId),
      time,
      reason
    });
  }

  async function getPatientAppointments(patientId) {
    return FakeAPI.listAppointmentsByPatient(Number(patientId));
  }

  // Simple alert rules
  function evaluateAlertsForPatient(patientId) {
    const record = patients.get(Number(patientId));
    if (!record) return [];

    const alerts = [];
    const avgHR = record.getAverageHeartRate();
    const lastSpO2 = record.getLastSpO2();

    if (avgHR != null && avgHR > 100) {
      alerts.push(`High average heart rate (${avgHR} bpm) for patient #${patientId}`);
    }
    if (lastSpO2 != null && lastSpO2 < 94) {
      alerts.push(`Low SpO2 (${lastSpO2}%) for patient #${patientId}`);
    }
    return alerts;
  }

  return {
    loadDoctors,
    registerOrUpdatePatient,
    getPatientRecord,
    bookAppointment,
    getPatientAppointments,
    evaluateAlertsForPatient
  };
}

// ---------------------------------------------------------------------------
// 4. UI wiring (vanilla JS)
// ---------------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const system = createSmartHealthcareSystem();

  const btnLoadDoctors = document.getElementById("btn-load-doctors");
  const doctorsListEl = document.getElementById("doctors-list");
  const doctorSelectEl = document.getElementById("appt-doctor-id");

  const formRegisterPatient = document.getElementById("form-register-patient");
  const patientSummaryEl = document.getElementById("patient-summary");

  const formAddVital = document.getElementById("form-add-vital");
  const patientStatsEl = document.getElementById("patient-stats");

  const formBookAppt = document.getElementById("form-book-appointment");
  const btnLoadAppointments = document.getElementById("btn-load-appointments");
  const appointmentsListEl = document.getElementById("appointments-list");

  const alertsListEl = document.getElementById("alerts-list");

  // Helper to render doctors
  function renderDoctors(doctors) {
    doctorsListEl.innerHTML = "";
    doctorSelectEl.innerHTML = '<option value="">Select doctor...</option>';

    doctors.forEach(doc => {
      const item = document.createElement("div");
      item.className = "list-item";
      item.innerHTML = `<strong>${doc.name}</strong> &mdash; ${doc.specialty} (ID: ${doc.id})`;
      doctorsListEl.appendChild(item);

      const opt = document.createElement("option");
      opt.value = doc.id;
      opt.textContent = `${doc.name} (${doc.specialty})`;
      doctorSelectEl.appendChild(opt);
    });
  }

  // Helper to render appointments
  function renderAppointments(appts) {
    appointmentsListEl.innerHTML = "";
    if (!appts.length) {
      appointmentsListEl.textContent = "No appointments.";
      return;
    }
    appts.forEach(a => {
      const div = document.createElement("div");
      div.className = "list-item";
      div.innerHTML = `
        <strong>Appt #${a.id}</strong> with Dr. ${a.doctorName}
        on <em>${new Date(a.time).toLocaleString()}</em><br/>
        Reason: ${a.reason} | Status: ${a.status}
      `;
      appointmentsListEl.appendChild(div);
    });
  }

  // Helper to render alerts
  function renderAlerts(alerts) {
    alertsListEl.innerHTML = "";
    if (!alerts.length) {
      alertsListEl.textContent = "No critical alerts.";
      return;
    }
    alerts.forEach(msg => {
      const div = document.createElement("div");
      div.className = "alert";
      div.textContent = msg;
      alertsListEl.appendChild(div);
    });
  }

  // 1) Load doctors
  btnLoadDoctors.addEventListener("click", async () => {
    btnLoadDoctors.disabled = true;
    btnLoadDoctors.textContent = "Loading...";
    try {
      const doctors = await system.loadDoctors();
      renderDoctors(doctors);
    } catch (err) {
      alert("Failed to load doctors: " + err.message);
    } finally {
      btnLoadDoctors.disabled = false;
      btnLoadDoctors.textContent = "Load Doctors";
    }
  });

  // 2) Register / update patient
  formRegisterPatient.addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("patient-id").value;
    const name = document.getElementById("patient-name").value;
    const age = document.getElementById("patient-age").value;
    const height = document.getElementById("patient-height").value;
    const weight = document.getElementById("patient-weight").value;

    try {
      const record = system.registerOrUpdatePatient({
        id,
        name,
        age,
        heightCm: height,
        weightKg: weight
      });
      const summary = record.getSummary();
      patientSummaryEl.textContent = JSON.stringify(summary, null, 2);
      renderAlerts(system.evaluateAlertsForPatient(id));
    } catch (err) {
      alert("Failed to register patient: " + err.message);
    }
  });

  // 3) Add vitals
  formAddVital.addEventListener("submit", e => {
    e.preventDefault();
    const patientId = document.getElementById("vital-patient-id").value;
    const type = document.getElementById("vital-type").value;
    const value = document.getElementById("vital-value").value;

    try {
      const record = system.getPatientRecord(patientId);
      record.addVital({ type, value });

      const summary = record.getSummary();
      patientStatsEl.textContent =
        `BMI: ${summary.bmi ?? "N/A"} | ` +
        `Avg HR: ${summary.avgHeartRate ?? "N/A"} bpm | ` +
        `Last SpO2: ${summary.lastSpO2 ?? "N/A"}%`;

      renderAlerts(system.evaluateAlertsForPatient(patientId));
    } catch (err) {
      alert("Failed to add vital: " + err.message);
    }
  });

  // 4) Book appointment
  formBookAppt.addEventListener("submit", async e => {
    e.preventDefault();
    const patientId = document.getElementById("appt-patient-id").value;
    const doctorId = document.getElementById("appt-doctor-id").value;
    const time = document.getElementById("appt-time").value;
    const reason = document.getElementById("appt-reason").value;

    if (!doctorId) {
      alert("Please select a doctor.");
      return;
    }

    try {
      const appt = await system.bookAppointment({
        doctorId,
        patientId,
        time: new Date(time).toISOString(),
        reason
      });
      alert(`Appointment #${appt.id} booked successfully.`);
    } catch (err) {
      alert("Failed to book appointment: " + err.message);
    }
  });

  // 5) Load appointments for patient
  btnLoadAppointments.addEventListener("click", async () => {
    const patientId = document.getElementById("appt-patient-id").value;
    if (!patientId) {
      alert("Enter Patient ID first (same as above).");
      return;
    }
    try {
      const appts = await system.getPatientAppointments(patientId);
      renderAppointments(appts);
    } catch (err) {
      alert("Failed to load appointments: " + err.message);
    }
  });
});