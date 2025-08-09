import React, { useState } from 'react';
import { REGISTER } from '../../../api/apiService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SignUpContent = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassWord] = useState("");
  const [email, setEmail] = useState("");
  const [locality, setLocality] = useState("");
  const [country, setCountry] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [street, setStreet] = useState("");
  const [role, setRole] = useState();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      userName: email,
      userPassword: password,
      active: 1,
      userDetails: {
        firstName,
        lastName,
        email,
        phoneNumber,
        street,
        locality,
        country,
      },
      role: {
        roleName: role
      }
    };
    console.log('role:', role);
    try {
      const response = await REGISTER("/accounts/registration", body);
      if (response) {
      toast.success("Đăng ký thành công!");
        navigate("/login");
      } else {
        toast.error("Đăng ký thất bại!");
      }
    } catch (error) {
      console.log("Error register: ", error.message);
      throw error;
    }
  };

  return (
    <section className="section-content padding-y" style={{ backgroundColor: '#ffffff', minHeight: '100vh', paddingTop: '40px' }}>
      <div className="card mx-auto shadow" style={{ maxWidth: '450px', borderRadius: '10px', borderColor: '#ff6600' ,backgroundColor: "#f8f9fa"}}>
        <article className="card-body">
          <header className="mb-4 text-center">
            <h3 className="text-center mb-4 fw-bold" style={{ color: '#ff6600' }}>ĐĂNG KÝ</h3>
          </header>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="col form-group">
                <label>Họ</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập họ"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="col form-group">
                <label>Tên</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập tên"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <small className="form-text text-muted">Chúng tôi sẽ không chia sẻ email của bạn.</small>
            </div>
          <div className="form-group">
  <label>Số điện thoại</label>
  <input
    type="tel"
    className="form-control"
    placeholder="Nhập số điện thoại"
    value={phoneNumber}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d*$/.test(value)) {
        setPhoneNumber(value);
        setPhoneError(""); // Xóa lỗi nếu đúng định dạng
      } else {
        setPhoneError("Chỉ được nhập số.");
      }
    }}
    onBlur={() => {
      if (phoneNumber.length < 9) {
        setPhoneError("Số điện thoại phải có ít nhất 9 chữ số.");
      }
    }}
    required
  />
  {phoneError && (
    <small className="form-text text-danger">{phoneError}</small>
  )}
</div>

            <div className="form-group">
              <label>Tên đường</label>
              <input
                type="text"
                className="form-control"
                placeholder="Nhập tên đường"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label className="mr-3">Vai trò: </label>
              <div className="form-check form-check-inline">
               <input
  className="form-check-input"
  type="radio"
  name="role"
  id="roleUser"
  value="USER"
  checked={role === "USER"}
  onChange={(e) => setRole(e.target.value)}
  required
/>

                <label className="form-check-label" htmlFor="roleUser">Người dùng</label>
              </div>
              <div className="form-check form-check-inline">
                <input
  className="form-check-input"
  type="radio"
  name="role"
  id="roleAdmin"
  value="ADMIN"
  checked={role === "ADMIN"}
  onChange={(e) => setRole(e.target.value)}
/>

                <label className="form-check-label" htmlFor="roleAdmin">Quản lý</label>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label>Thành phố</label>
                <input
                  type="text"
                  className="form-control"
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                />
              </div>
              <div className="form-group col-md-6">
                <label>Quốc gia</label>
                <select
                  className="form-control"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="">Chọn quốc gia...</option>
                  <option value="Việt Nam">Việt Nam</option>
                  <option value="Úc">Úc</option>
                  <option value="Anh">Anh</option>
                  <option value="India">India</option>
                  <option value="Mỹ">Mỹ</option>
                </select>
              </div>
            </div>
            <div className="form-row mt-3">
              <div className="form-group col-md-6">
                <label>Mật khẩu</label>
                <input
                  className="form-control"
                  type="password"
                  value={password}
                  onChange={(e) => setPassWord(e.target.value)}
                  required
                />
              </div>
              <div className="form-group col-md-6">
                <label>Nhập lại mật khẩu</label>
                <input
                  className="form-control"
                  type="password"
                  required
                />
              </div>
            </div>
            <div className="form-group mt-4">
              <button
                type="submit"
                className="btn btn-warning w-100 py-2 fw-semibold "
                style={{  fontWeight: '600' }}
              >
                Đăng ký
              </button>
            </div>
            <div className="form-group text-center">
              <label className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" required />
                <span className="custom-control-label" style={{ marginLeft: '8px' }}>
                  Tôi đồng ý với <a href="/">các điều khoản</a>
                </span>
              </label>
            </div>
          </form>
        </article>
      </div>
      <p className="text-center mt-4">
        Đã có tài khoản? <a href="/login" style={{ color: '#ff6600', fontWeight: '600' }}>Đăng nhập</a>
      </p>
    </section>
  );
};

export default SignUpContent;
