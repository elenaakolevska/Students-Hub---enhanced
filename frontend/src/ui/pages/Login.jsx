import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../../contexts/authContext";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useContext(authContext);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(formData);
      toast.success("Успешно се најавивте!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Погрешни податоци. Проверете го корисничкото име и лозинката.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #ece9e6, #ffffff)",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div
              className="card shadow-lg border-0"
              style={{
                borderRadius: "1rem",
                background: "linear-gradient(145deg, #fdfbfb, #ebedee)",
              }}
            >
              <div className="card-body p-5">
                <h2 className="text-center mb-1 fw-bold">Добредојдовте</h2>
                <p className="text-center text-muted mb-4">
                  Најавете се за да продолжите
                </p>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">
                      Корисничко име
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">
                      Лозинка
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Се најавувате...
                      </>
                    ) : (
                      "Најавете се"
                    )}
                  </button>
                </form>

                <hr />

                <p className="text-center mb-0">
                  Немате профил?{" "}
                  <a href="/register" className="text-decoration-none">
                    Регистрирајте се
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
