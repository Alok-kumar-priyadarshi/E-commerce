import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../api/axios"

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setError("");
    if (!email) {
      setError("Email filed is required ! ");
      return;
    }
    if (!password) {
      setError("password filed is required ! ");
      return;
    }

    if (password !== confirmPassword) {
      setError("passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", {
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      console.log(err.response?.data); // DEBUG

      if (err.response?.status === 422) {
        const errors = err.response.data.detail;

        const messages = errors.map((e) => e.msg).join(", ");
        setError(messages);
      } else if (err.response?.data?.detail) {
        setError(err.response.data.detail);
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold mb-4">Register</h2>

          {error && <div className="text-red-500 mb-3">{error}</div>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border p-2 mb-4 rounded"
          />

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <div className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
