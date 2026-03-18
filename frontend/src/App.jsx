import { useState, useEffect } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submissions, setSubmissions] = useState([]);
  const [status, setStatus] = useState(""); // "loading" | "success" | "error"

  // Fetch all submissions on load
  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get(`${API}/api/contacts`);
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await axios.post(`${API}/api/contact`, form);
      setStatus("success");
      setForm({ name: "", email: "", message: "" }); // Reset form
      fetchSubmissions(); // Refresh list
    } catch (err) {
      setStatus("error");
      console.log(err)
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Contact Form</h2>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          name="name"
          placeholder="Your Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={handleChange}
          rows={4}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Submitting..." : "Submit"}
        </button>

        {status === "success" && <p style={{ color: "green" }}>✅ Submitted successfully!</p>}
        {status === "error" && <p style={{ color: "red" }}>❌ Something went wrong. Try again.</p>}
      </form>

      <hr style={{ margin: "30px 0" }} />

      <h3>All Submissions</h3>
      {submissions.length === 0 ? (
        <p>No submissions yet.</p>
      ) : (
        submissions.map((s) => (
          <div key={s.id} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "10px", borderRadius: "6px" }}>
            <strong>{s.name}</strong> — {s.email}
            <p>{s.message}</p>
            <small style={{ color: "#888" }}>{new Date(s.created_at).toLocaleString()}</small>
          </div>
        ))
      )}
    </div>
  );
}
