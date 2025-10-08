let teacherNote = "Var extra uppmuntrande mot elever som är osäkra på sin spanska.";

export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({ teacherNote });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

export function getTeacherNote() {
  return teacherNote;
}
