import { KEYS, getStorage, initStorage } from "@/lib/storage";
export const ACTIVE_YEAR = "2025-2026";
const classNames = ["Class 1", "Class 2", "Class 3", "Class 4", "Class 5", "Class 6"];
const classes = [
  { id: "c1", name: "Class 1", sections: ["A", "B", "C"] },
  { id: "c2", name: "Class 2", sections: ["A", "B"] },
  { id: "c3", name: "Class 3", sections: ["A", "B"] },
  { id: "c4", name: "Class 4", sections: ["A", "B"] },
  { id: "c5", name: "Class 5", sections: ["A"] },
  { id: "c6", name: "Class 6", sections: ["A", "B"] },
];
const heads = (tuition, transport) => [
  { name: "Tuition Fee", amount: tuition },
  { name: "Admission Fee", amount: 5000 },
  { name: "Transport Fee", amount: transport },
  { name: "Books", amount: 3500 },
  { name: "Uniform", amount: 2500 },
  { name: "Examination Fee", amount: 2000 },
  { name: "Activity Fee", amount: 1500 },
];
const feeStructures = classNames.map((name, i) => ({
  id: `fs${i + 1}`,
  name: `${name} Regular Fee`,
  className: name,
  academicYear: ACTIVE_YEAR,
  active: true,
  heads: heads(18000 + i * 2000, 6000),
}));
export const structureTotal = (s) => s.heads.reduce((t, h) => t + h.amount, 0);
const feeTerms = feeStructures.flatMap((s) => {
  const total = structureTotal(s);
  const part = Math.round(total / 3 / 100) * 100;
  return [
    { id: `${s.id}-t1`, structureId: s.id, name: "Term 1", amount: part, dueDate: "2025-06-15" },
    { id: `${s.id}-t2`, structureId: s.id, name: "Term 2", amount: part, dueDate: "2025-09-15" },
    {
      id: `${s.id}-t3`,
      structureId: s.id,
      name: "Term 3",
      amount: total - part * 2,
      dueDate: "2026-01-15",
    },
  ];
});
const firstNames = [
  "Aarav",
  "Diya",
  "Vihaan",
  "Ananya",
  "Arjun",
  "Ishita",
  "Reyansh",
  "Meera",
  "Kabir",
  "Saanvi",
  "Aditya",
  "Kavya",
  "Rohan",
  "Nitya",
  "Sai",
  "Advika",
  "Dhruv",
  "Tanvi",
  "Karthik",
  "Shreya",
  "Rahul",
  "Aishwarya",
  "Nikhil",
  "Pooja",
  "Manish",
  "Divya",
  "Harsha",
  "Lakshmi",
  "Varun",
  "Sneha",
  "Pranav",
  "Anjali",
];
const lastNames = [
  "Reddy",
  "Sharma",
  "Rao",
  "Naidu",
  "Patel",
  "Iyer",
  "Kumar",
  "Verma",
  "Chowdary",
  "Menon",
  "Nair",
  "Gupta",
  "Shetty",
  "Joshi",
  "Prasad",
  "Mehta",
];
const fatherFirst = [
  "Suresh",
  "Ramesh",
  "Venkat",
  "Anil",
  "Mahesh",
  "Prakash",
  "Srinivas",
  "Rajesh",
];
const motherFirst = [
  "Lakshmi",
  "Padma",
  "Sunita",
  "Anitha",
  "Geetha",
  "Radha",
  "Kavitha",
  "Sarala",
];
const bloods = ["A+", "B+", "O+", "AB+", "O-", "A-"];
function buildStudents() {
  const list = [];
  for (let i = 0; i < 32; i++) {
    const cls = classes[i % classes.length];
    const section = cls.sections[i % cls.sections.length];
    const last = lastNames[i % lastNames.length];
    const first = firstNames[i];
    const structure = feeStructures.find((s) => s.className === cls.name);
    list.push({
      id: `s${i + 1}`,
      admissionNo: `ED-${String(1001 + i)}`,
      studentId: `STU${String(2001 + i)}`,
      firstName: first,
      lastName: last,
      dob: `201${5 - (i % 6)}-0${(i % 9) + 1}-1${i % 9}`,
      gender: i % 2 === 0 ? "Male" : "Female",
      bloodGroup: bloods[i % bloods.length],
      aadhaar: `XXXX XXXX ${1000 + i}`,
      admissionDate: `2025-0${(i % 6) + 1}-1${i % 9}`,
      fatherName: `${fatherFirst[i % fatherFirst.length]} ${last}`,
      fatherPhone: `98${String(48000000 + i * 1237).slice(0, 8)}`,
      fatherEmail: `${fatherFirst[i % fatherFirst.length].toLowerCase()}.${last.toLowerCase()}@gmail.com`,
      motherName: `${motherFirst[i % motherFirst.length]} ${last}`,
      motherPhone: `97${String(39000000 + i * 4391).slice(0, 8)}`,
      motherEmail: `${motherFirst[i % motherFirst.length].toLowerCase()}.${last.toLowerCase()}@gmail.com`,
      guardianName: `${fatherFirst[i % fatherFirst.length]} ${last}`,
      guardianRelation: "Father",
      guardianPhone: `98${String(48000000 + i * 1237).slice(0, 8)}`,
      address: `${10 + i}-${i + 2}, Vidya Nagar, Thikkonda, Telangana 500${String(100 + i)}`,
      academicYear: ACTIVE_YEAR,
      className: cls.name,
      section,
      rollNo: String(i + 1).padStart(2, "0"),
      previousClass:
        cls.name === "Class 1" ? "Nursery" : `Class ${Number(cls.name.split(" ")[1]) - 1}`,
      previousSchool: i % 4 === 0 ? "Little Scholars School" : "—",
      feeCategory: i % 7 === 0 ? "Sibling Concession" : "Regular",
      structureId: structure.id,
      discount: i % 7 === 0 ? 2500 : 0,
    });
  }
  return list;
}
const cashiers = [
  {
    id: "ca1",
    name: "Ravi Teja",
    employeeId: "EMP-101",
    email: "ravi@edifyschool.in",
    phone: "9848012345",
    username: "cashier",
    password: "cashier123",
    status: "active",
    createdAt: "2025-04-02",
  },
  {
    id: "ca2",
    name: "Sunita Rao",
    employeeId: "EMP-102",
    email: "sunita@edifyschool.in",
    phone: "9848098765",
    username: "sunita",
    password: "cashier123",
    status: "active",
    createdAt: "2025-05-18",
  },
  {
    id: "ca3",
    name: "Mohan Krishna",
    employeeId: "EMP-103",
    email: "mohan@edifyschool.in",
    phone: "9848077712",
    username: "mohan",
    password: "cashier123",
    status: "inactive",
    createdAt: "2025-06-09",
  },
];
const admins = [
  { id: "u1", name: "Admin", username: "admin", password: "admin123", role: "admin" },
];
const academicYears = [
  { id: "ay1", name: "2025-2026", active: true },
  { id: "ay2", name: "2026-2027", active: false },
  { id: "ay3", name: "2027-2028", active: false },
];
const settings = {
  schoolName: "Edify School",
  tagline: "Think Beyond",
  location: "Thikkonda",
  address: "Survey No. 42, Vidya Nagar, Thikkonda, Telangana 500100",
  phone: "+91 98480 00000",
  email: "office@edifyschool.in",
  website: "www.edifyschool.in",
  receiptFooter: "This is a computer generated receipt. Fees once paid are non-refundable.",
  principal: "Dr. Lalitha Krishnan",
};
const modes = ["Cash", "UPI", "Card", "Bank Transfer"];
function buildPayments(students) {
  const list = [];
  const today = new Date();
  let n = 1;
  students.forEach((st, i) => {
    if (i % 5 === 4) return; // some students have no payments (pending)
    const structure = feeStructures.find((s) => s.id === st.structureId);
    const total = structureTotal(structure) - st.discount;
    const installments = (i % 3) + 1;
    for (let k = 0; k < installments; k++) {
      const d = new Date(today);
      d.setDate(today.getDate() - ((i * 3 + k * 11) % 45));
      list.push({
        id: `p${n}`,
        receiptNo: `ED-2026-${String(n).padStart(4, "0")}`,
        studentId: st.id,
        date: d.toISOString().slice(0, 10),
        amount: Math.round(total / 3 / 100) * 100,
        mode: modes[(i + k) % modes.length],
        reference: modes[(i + k) % modes.length] === "Cash" ? "—" : `TXN${900000 + n}`,
        remarks: k === 0 ? "Term 1 fee" : `Term ${k + 1} fee`,
        cashierName: cashiers[(i + k) % 2].name,
        academicYear: ACTIVE_YEAR,
        status: "Success",
      });
      n++;
    }
  });
  // a few of today's transactions
  students.slice(0, 3).forEach((st, i) => {
    list.push({
      id: `p${n}`,
      receiptNo: `ED-2026-${String(n).padStart(4, "0")}`,
      studentId: st.id,
      date: today.toISOString().slice(0, 10),
      amount: 5000 + i * 1500,
      mode: modes[i % modes.length],
      reference: i === 0 ? "—" : `TXN${910000 + i}`,
      remarks: "Part payment",
      cashierName: cashiers[0].name,
      academicYear: ACTIVE_YEAR,
      status: "Success",
    });
    n++;
  });
  return list;
}
export function seedDemoData() {
  initStorage(KEYS.users, admins);
  initStorage(KEYS.cashiers, cashiers);
  initStorage(KEYS.classes, classes);
  initStorage(KEYS.feeStructures, feeStructures);
  initStorage(KEYS.feeTerms, feeTerms);
  initStorage(KEYS.academicYears, academicYears);
  initStorage(KEYS.settings, settings);
  initStorage(KEYS.activeYear, ACTIVE_YEAR);
  const students = getStorage(KEYS.students, []);
  if (students.length === 0) {
    const fresh = buildStudents();
    initStorage(KEYS.students, fresh);
    initStorage(KEYS.payments, buildPayments(fresh));
  } else {
    initStorage(KEYS.payments, []);
  }
}
