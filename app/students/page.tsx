"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./students.module.css";
// import Cookies from "js-cookie";

interface Student {
  id: string;
  name: string;
  email: string;
  major: string;
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [major, setMajor] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [page, setPage] = useState(1);
  const studentPerPage = 5;
  const indexOfLast = page * studentPerPage;
  const indexOfFirst = indexOfLast - studentPerPage;
  const currentStudents = (filteredStudents ?? students).slice(
    indexOfFirst,
    indexOfLast
  );

  const generateMatricNumber = () => {
    const number = students.length + 1;
    return `MAT${number.toString().padStart(4, "0")}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem("students");
    if (saved) {
      const parsed = JSON.parse(saved);
      setStudents(parsed);
      setFilteredStudents(parsed);
    }
    setLoaded(true);
  }, []);

  const handleEditStudent = (student: Student) => {
    setEditId(student.id);
    setName(student.name);
    setEmail(student.email);
    setMajor(student.major);
  };
  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    setSearchPerformed(true);
    if (term.trim() === "") {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.email.toLowerCase().includes(term) ||
        s.major.toLowerCase().includes(term) ||
        s.id.toLowerCase().includes(term)
    );
    setFilteredStudents(filtered);
  };
  useEffect(() => {
    setFilteredStudents(students);
  }, [students]);


  const saveStudent = async () => {
    if (!name || !email || !major) {
      alert("Please fill in all fields");
      return;
    }
    setLoading(true);
    const currentName = name;
    const currentEmail = email;
    const currentMajor = major;
    setName("");
    setEmail("");
    setMajor("");

    try {
      if (editId) {
        const updatedStudents = filteredStudents.map((s) =>
          s.id === editId ? { ...s, name, email, major } : s
        );
        setStudents(updatedStudents);
        setEditId(null);
        alert("Student updated successfully");
      } else {
        const newStudent: Student = {
          id: generateMatricNumber(),
          name,
          email,
          major,
        };
        setStudents((prev) => [...prev, newStudent]);
        setAllStudents((prev) => [...prev, newStudent]);
        // await axios.post(
        //   "https://jsonplaceholder.typicode.com/posts",
        //   newStudent
        // );
        alert("Student added successfully");
      }

      setName("");
      setEmail("");
      setMajor("");
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem("students", JSON.stringify(students));
  }, [students, loaded]);

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => {
      const updatedStudents = prev.filter((s) => s.id !== id);
      if ((page - 1) * studentPerPage >= updatedStudents.length && page > 1) {
        setPage(page - 1);
      }
      setFilteredStudents(updatedStudents);
      return updatedStudents;
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Students System</h1>

      <div>
        <span className={styles.student}>search students: </span>{" "}
        <input
          type="text"
          placeholder="search students"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button onClick={handleSearch} className={styles.button}>
          Search
        </button>
      </div>
      <div>
        {searchPerformed && (
          <button
            onClick={() => {
              setFilteredStudents(students);
              setSearchTerm("");
            }}
            className={styles.button}
          >
            show all
          </button>
        )}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>MAJOR</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody className={styles.body}>
          {currentStudents.map((student) => (
            <tr key={student.id}>
              <td>{student.id}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.major}</td>
              <td>
                <button
                  className={styles.editButton}
                  onClick={() => handleEditStudent(student)}
                >
                  Edit
                </button>
              </td>
              <td>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteStudent(student.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Major"
          value={major}
          onChange={(e) => setMajor(e.target.value)}
          className={styles.input}
        />
      </form>

      <button
        type="button"
        onClick={saveStudent}
        className={styles.button}
        disabled={loading}
      >
        {editId ? "Update Student" : "Add Student"}
      </button>
      <div>
        <button
          className={styles.button}
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>
        <span className={styles.page}>page {page}</span>
        <button
          className={styles.button}
          disabled={indexOfLast >= (filteredStudents ?? students).length}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
