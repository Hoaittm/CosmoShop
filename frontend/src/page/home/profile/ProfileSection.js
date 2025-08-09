import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../../../context/UserContext';
import { GET_ID } from '../../../api/apiService';
import { useSelector } from 'react-redux';

const ProfileSection = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [ userDetails, setUserDetails ] = useState({
        firstName:"",
        lastName:"",
        email:"",
        phoneNumber:"",
        street:"",
   
        country:"",
    });
     useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const response = await GET_ID(`/accounts/users/${user.userID}`);
                    
                    if(response && response.userDetails){
                        setUserDetails(response.userDetails)
                    }
                    console.log("data11: ", response.userDetails);
                 
                } catch (error) {
                    console.log("Error fetching user data: ", error);
                }
            };
        
            fetchUserData();
        }, [user.userID]);
    const handleLogOut = () => {
 
       // setUser({username: "", userID: null});
        navigate("/logout");
    }
    return (
        <>
            {/* <section class="section-pagetop bg-gray">
                <div class="container">
                    <h2 class="title-page">Tài khoản của tôi</h2>
                </div>
            </section> */}
            <section class="section-content padding-y">
                <div class="container">
                    <div class="row">
                
                        <main class="col-md">
                        <h2 class="title-page">Tài khoản của tôi</h2>
                            <div class="card">
                                <div class="card-body">
                                    <form class="row">
                                        <div class="col-md-9">
                                            <div class="form-row">
                                                <div class="col form-group">
                                                    <label>Họ và tên</label>
                                                    <input type="text" class="form-control" value={userDetails.firstName + " " + userDetails.lastName} />
                                                </div>
                                                <div class="col form-group">
                                                    <label>Email</label>
                                                    <input type="email" class="form-control" value={userDetails.email} />
                                                </div>
                                            </div>

                                            <div class="form-row">
                                                <div class="form-group col-md-6">
                                                    <label>Địa chỉ</label>
                                                    <input type="email" class="form-control" value={userDetails.street} />
                                                </div>
                                                <div class="form-group col-md-6">
                                                    <label>Thành phố</label>
                                                    <input type="email" class="form-control" value={userDetails.country} />
                                                </div>
                                            </div>

                                            <div class="form-row">
                                                
                                                <div class="form-group col-md-6">
                                                    <label>Số điện thoại</label>
                                                    <input type="email" class="form-control" value={userDetails.phoneNumber} />
                                                </div>
                                            </div>

                                            {/* <button class="btn btn-primary">Save</button>
                                            <button class="btn btn-light">Change password</button> */}

                                            <br /><br /><br /><br /><br /><br />
                                        </div>
                                        {/* <div class="col-md">
                                            <img src="images/avatars/avatar1.jpg" class="img-md rounded-circle border" />
                                        </div> */}
                                         <div class="form-row">
                                        <div class="col-md-3">
                                            <Link to="/order" class="btn btn-primary">Đơn hàng đã mua</Link>
                                        </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProfileSection
