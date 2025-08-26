import React, { useState } from "react";
     import axios from "axios";
     import { useNavigate } from 'react-router-dom';

     const Login = () => {
       const navigate = useNavigate();
       const [username, setUsername] = useState('');
       const [password, setPassword] = useState('');

       const handleSubmit = async (e) => {
         e.preventDefault();
         try {
           const res = await axios.post('http://localhost:5000/api/login', { username, password });
           localStorage.setItem('token', res.data.token);
           localStorage.setItem('role', res.data.role);
           console.log('Token stocké:', res.data.token); // Débogage
           if (res.data.role === 'admin') {
             navigate('/Dashboard');
           } else if (res.data.role === 'operateur') {
             navigate('/Operateur');
           }
         } catch (error) {
           console.error('Erreur de login:', error.response?.data);
           alert('Identifiants incorrects');
         }
       };

       return (
         <div className="login-page">
           <div className="login-header box-shadow">
             <div className="container-fluid d-flex justify-content-between align-items-center">
             </div>
           </div>

           <div className="login-wrap d-flex align-items-center flex-wrap justify-content-center">
             <div className="container">
               <div className="row align-items-center">
                 <div className="col-md-6 col-lg-7">
                   <img src="/assets/images/login-page-img.png" alt="login" />
                 </div>
                 <div className="col-md-6 col-lg-5">
                   <div className="login-box bg-white box-shadow border-radius-10">
                     <div className="login-title">
                       <h2 className="text-center text-primary">Login</h2>
                     </div>
                     <form onSubmit={handleSubmit}>
                       <div className="input-group custom mb-3">
                         <input
                           type="text"
                           className="form-control form-control-lg"
                           placeholder="Username"
                           value={username}
                           onChange={(e) => setUsername(e.target.value)}
                           required
                         />
                         <div className="input-group-append custom">
                           <span className="input-group-text"><i className="icon-copy dw dw-user1"></i></span>
                         </div>
                       </div>
                       <div className="input-group custom mb-4">
                         <input
                           type="password"
                           className="form-control form-control-lg"
                           placeholder=" Password"
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                           required
                         />
                         <div className="input-group-append custom">
                           <span className="input-group-text"><i className="dw dw-padlock1"></i></span>
                         </div>
                       </div>
                       <div className="input-group mb-0">
                         <button className="btn btn-primary btn-lg btn-block" type="submit">
                           Sign In
                         </button>
                       </div>
                     </form>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         </div>
       );
     };

     export default Login;