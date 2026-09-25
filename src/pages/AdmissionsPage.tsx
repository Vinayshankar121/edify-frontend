import { useNavigate } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Field, KeyValue, PageHeader, SectionCard } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import {
  uid,
  useAcademicYears,
  useActiveYear,
  useClasses,
  useFeeStructures,
  usePayments,
  useStudents,
} from "@/hooks/useSchoolData";
import { inr, nextReceiptNo, structureTotal, today } from "@/lib/fees";
import type { PaymentMode, Student } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Student", "Parents", "Academic", "Fees", "Review"];
type Form = Omit<Student, "id"> & { initialPayment: number; paymentMode: PaymentMode };

const empty = (year: string, n: number): Form => ({
  admissionNo: `EDF/${year.slice(0, 4)}/${String(n).padStart(3, "0")}`,
  studentId: `STU${String(1000 + n)}`,
  firstName: "", lastName: "", dob: "", gender: "Male", bloodGroup: "", aadhaar: "",
  admissionDate: today(), fatherName: "", fatherPhone: "", fatherEmail: "", motherName: "",
  motherPhone: "", motherEmail: "", guardianName: "", guardianRelation: "", guardianPhone: "",
  address: "", academicYear: year, className: "", section: "", rollNo: "", previousClass: "",
  previousSchool: "", feeCategory: "General", structureId: "", discount: 0,
  initialPayment: 0, paymentMode: "Cash",
});

const phoneOk = (v: string) => !v || /^[6-9]\d{9}$/.test(v);
const emailOk = (v: string) => !v || /^\S+@\S+\.\S+$/.test(v);

export function AdmissionsPage({ editId }: { editId?: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: students, setData: setStudents, ready } = useStudents();
  const { data: payments, setData: setPayments } = usePayments();
  const { data: classes } = useClasses();
  const { data: structures } = useFeeStructures();
  const { data: years } = useAcademicYears();
  const { data: activeYear } = useActiveYear();
  const editing = students.find((s) => s.id === editId);
  const [step, setStep] = useState(0);
  const [f, setF] = useState<Form>(() => empty(activeYear, 1));
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!ready) return;
    if (editing) setF({ ...editing, initialPayment: 0, paymentMode: "Cash" });
    else setF(empty(activeYear, students.length + 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, editId, activeYear]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setF((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: "" }));
  };
  const sections = classes.find((c) => c.name === f.className)?.sections ?? [];
  const classStructures = structures.filter((s) => s.className === f.className && s.active);
  const structure = structures.find((s) => s.id === f.structureId);
  const total = structureTotal(structure);

  const validate = (i: number) => {
    const e: Record<string, string> = {};
    if (i === 0) {
      if (!f.admissionNo) e.admissionNo = "Required";
      else if (students.some((s) => s.admissionNo === f.admissionNo && s.id !== editId)) e.admissionNo = "Already exists";
      if (!f.firstName.trim()) e.firstName = "Required";
      if (!f.lastName.trim()) e.lastName = "Required";
      if (!f.dob) e.dob = "Required";
      if (f.aadhaar && !/^\d{12}$/.test(f.aadhaar.replace(/\s/g, ""))) e.aadhaar = "Aadhaar must be 12 digits";
    }
    if (i === 1) {
      if (!f.fatherName.trim() && !f.guardianName.trim()) e.fatherName = "Father or guardian name required";
      if (!f.fatherPhone && !f.guardianPhone) e.fatherPhone = "At least one contact number required";
      (["fatherPhone", "motherPhone", "guardianPhone"] as const).forEach((k) => { if (!phoneOk(f[k])) e[k] = "Enter a valid 10-digit mobile"; });
      (["fatherEmail", "motherEmail"] as const).forEach((k) => { if (!emailOk(f[k])) e[k] = "Enter a valid email"; });
      if (!f.address.trim()) e.address = "Required";
    }
    if (i === 2) {
      if (!f.className) e.className = "Required";
      if (!f.section) e.section = "Required";
    }
    if (i === 3) {
      if (!f.structureId) e.structureId = "Select a fee structure";
      if (f.discount < 0 || f.discount > total) e.discount = "Discount must be between 0 and total fee";
      if (f.initialPayment < 0 || f.initialPayment > total - f.discount) e.initialPayment = "Cannot exceed payable amount";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => validate(step) && setStep((s) => Math.min(s + 1, 4));

  const submit = () => {
    const { initialPayment, paymentMode, ...data } = f;
    if (editing) {
      setStudents(students.map((s) => (s.id === editing.id ? { ...data, id: editing.id } : s)));
      toast.success("Student details updated.");
      navigate({ to: "/admin/students/$id", params: { id: editing.id } });
      return;
    }
    const id = uid();
    setStudents([...students, { ...data, id }]);
    if (initialPayment > 0) {
      const receiptNo = nextReceiptNo(payments);
      setPayments([
        ...payments,
        { id: uid(), receiptNo, studentId: id, date: today(), amount: initialPayment, mode: paymentMode, reference: "", remarks: "Admission payment", cashierName: user?.name ?? "Admin", academicYear: f.academicYear, status: "Success" },
      ]);
      toast.success(`Student successfully admitted. Receipt #${receiptNo} generated.`);
    } else toast.success("Student successfully admitted.");
    navigate({ to: "/admin/students/$id", params: { id } });
  };

  const inp = (k: keyof Form, label: string, opts: { required?: boolean; type?: string; placeholder?: string } = {}) => (
    <Field label={label} required={opts.required} error={errors[k as string]}>
      <Input
        type={opts.type ?? "text"}
        value={String(f[k] ?? "")}
        placeholder={opts.placeholder}
        aria-invalid={!!errors[k as string]}
        onChange={(e) => set(k, (opts.type === "number" ? Number(e.target.value) : e.target.value) as never)}
      />
    </Field>
  );

  const review = useMemo(
    () => [
      ["Student", `${f.firstName} ${f.lastName}`], ["Admission No", f.admissionNo], ["DOB", f.dob], ["Gender", f.gender],
      ["Father", f.fatherName], ["Contact", f.fatherPhone || f.guardianPhone], ["Mother", f.motherName], ["Address", f.address],
      ["Year", f.academicYear], ["Class", `${f.className} ${f.section}`], ["Roll No", f.rollNo], ["Fee structure", structure?.name ?? ""],
      ["Total fee", inr(total)], ["Discount", inr(f.discount)], ["Payable", inr(total - f.discount)], ["Initial payment", `${inr(f.initialPayment)} · ${f.paymentMode}`],
    ],
    [f, structure, total],
  );

  return (
    <>
      <PageHeader title={editing ? "Edit student" : "New admission"} subtitle="Complete each step — fields marked * are required." />
      <div className="surface animate-rise mb-6 p-5">
        <div className="flex items-center justify-between gap-2">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => i < step && setStep(i)}
              className="flex flex-1 flex-col items-center gap-2 text-center"
            >
              <span className={cn(
                "grid size-9 place-items-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                i < step ? "border-primary bg-primary text-primary-foreground" : i === step ? "border-primary text-primary" : "border-border text-muted-foreground",
              )}>
                {i < step ? <Check className="size-4" /> : i + 1}
              </span>
              <span className={cn("hidden text-xs font-medium sm:block", i === step ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </button>
          ))}
        </div>
        <Progress value={(step / 4) * 100} className="mt-4 h-1.5" />
      </div>

      <SectionCard key={step} title={["Student information", "Parent / guardian information", "Academic information", "Fee information", "Review & submit"][step]}>
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {inp("admissionNo", "Admission number", { required: true })}
            {inp("studentId", "Student ID")}
            {inp("admissionDate", "Admission date", { type: "date" })}
            {inp("firstName", "First name", { required: true })}
            {inp("lastName", "Last name", { required: true })}
            {inp("dob", "Date of birth", { required: true, type: "date" })}
            <Field label="Gender" required>
              <Select value={f.gender} onValueChange={(v) => set("gender", v as Form["gender"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["Male", "Female", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Blood group">
              <Select value={f.bloodGroup || undefined} onValueChange={(v) => set("bloodGroup", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {inp("aadhaar", "Aadhaar / ID number", { placeholder: "12 digits" })}
            {inp("previousSchool", "Previous school")}
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-3">
            {inp("fatherName", "Father's name", { required: true })}
            {inp("fatherPhone", "Father's phone", { required: true })}
            {inp("fatherEmail", "Father's email", { type: "email" })}
            {inp("motherName", "Mother's name")}
            {inp("motherPhone", "Mother's phone")}
            {inp("motherEmail", "Mother's email", { type: "email" })}
            {inp("guardianName", "Guardian name")}
            {inp("guardianRelation", "Relationship")}
            {inp("guardianPhone", "Guardian phone")}
            <Field label="Address" required error={errors.address} className="md:col-span-3">
              <Textarea value={f.address} onChange={(e) => set("address", e.target.value)} />
            </Field>
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Academic year" required>
              <Select value={f.academicYear} onValueChange={(v) => set("academicYear", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{years.filter((y) => !y.closed).map((y) => <SelectItem key={y.id} value={y.name}>{y.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Class" required error={errors.className}>
              <Select value={f.className || undefined} onValueChange={(v) => { set("className", v); set("section", ""); set("structureId", ""); }}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>{classes.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Section" required error={errors.section}>
              <Select value={f.section || undefined} onValueChange={(v) => set("section", v)} disabled={!f.className}>
                <SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger>
                <SelectContent>{sections.map((s) => <SelectItem key={s} value={s}>Section {s}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {inp("rollNo", "Roll number")}
            {inp("previousClass", "Previous class")}
            {inp("previousSchool", "Previous school")}
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Fee category">
              <Select value={f.feeCategory} onValueChange={(v) => set("feeCategory", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{["General", "Staff Ward", "Sibling", "Scholarship"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            <Field label="Applicable fee structure" required error={errors.structureId} className="md:col-span-2">
              <Select value={f.structureId || undefined} onValueChange={(v) => set("structureId", v)}>
                <SelectTrigger><SelectValue placeholder={classStructures.length ? "Select structure" : "No active structure for this class"} /></SelectTrigger>
                <SelectContent>{classStructures.map((s) => <SelectItem key={s.id} value={s.id}>{s.name} · {inr(structureTotal(s))}</SelectItem>)}</SelectContent>
              </Select>
            </Field>
            {inp("discount", "Discount (₹)", { type: "number" })}
            {!editing && inp("initialPayment", "Initial payment (₹)", { type: "number" })}
            {!editing && (
              <Field label="Payment mode">
                <Select value={f.paymentMode} onValueChange={(v) => set("paymentMode", v as PaymentMode)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Cash", "UPI", "Card", "Bank Transfer"].map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
            )}
            {structure && (
              <div className="rounded-xl bg-accent p-4 text-sm text-accent-foreground md:col-span-3">
                Total {inr(total)} − discount {inr(f.discount)} = <b>{inr(total - f.discount)} payable</b>
              </div>
            )}
          </div>
        )}
        {step === 4 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {review.map(([k, v]) => <KeyValue key={k} label={k} value={v} />)}
          </div>
        )}

        <div className="mt-8 flex justify-between border-t border-border pt-5">
          <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
            <ChevronLeft className="mr-1 size-4" /> Back
          </Button>
          {step < 4 ? (
            <Button onClick={next}>Continue <ChevronRight className="ml-1 size-4" /></Button>
          ) : (
            <Button onClick={submit}><Check className="mr-2 size-4" /> {editing ? "Save changes" : "Submit admission"}</Button>
          )}
        </div>
      </SectionCard>
    </>
  );
}
