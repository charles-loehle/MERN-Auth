import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Layout from '../core/Layout';
import axios from 'axios';
import { isAuth, updateUser, getCookie, signout } from '../auth/helpers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

const Private = ({ history }) => {
  const [values, setValues] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    buttonText: 'Submit',
  });

  const token = getCookie('token');

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line
  }, []);

  const loadProfile = () => {
    axios({
      method: 'GET',
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log('PRIVATE PROFILE UPDATE', response);
        const { role, name, email } = response.data;
        setValues({ ...values, role, name, email });
      })
      .catch((error) => {
        console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
        if (error.response.status === 401) {
          signout(() => {
            history.push('/');
          });
        }
      });
  };

  const { role, name, email, password, buttonText } = values;

  const handleChange = (event) => {
    // console.log(event.target.value);
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const clickSubmit = (event) => {
    event.preventDefault();
    setValues({ ...values, buttonText: 'Submitting' });
    axios({
      method: 'PUT',
      // http://localhost:8000/api/signup
      url: `${process.env.REACT_APP_API}/user/update`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { name, password },
    })
      .then((response) => {
        console.log('PRIVATE PROFILE UPDATE SUCCESS', response);
        updateUser(response, () => {
          setValues({
            ...values,
            buttonText: 'Submitted',
          });
          toast.success('Profile updated successfully');
        });
      })
      .catch((error) => {
        console.log('PRIVATE PROFILE UPDATE ERROR', error.response.data.error);
        setValues({ ...values, buttonText: 'Submit' });
        toast.error(error.response.data.error);
      });
  };

  const updateForm = (
    <form>
      <div className="form-group">
        <label className="text-muted">Role</label>
        <input
          disabled
          name="name"
          value={role}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Name</label>
        <input
          onChange={handleChange}
          name="name"
          value={name}
          type="text"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          disabled
          name="email"
          value={email}
          type="email"
          className="form-control"
        />
      </div>

      <div className="form-group">
        <label className="text-muted">Password</label>
        <input
          onChange={handleChange}
          name="password"
          value={password}
          type="password"
          className="form-control"
        />
      </div>

      <div>
        <button className="btn btn-primary" onClick={clickSubmit}>
          {buttonText}
        </button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        <ToastContainer />
        <h1 className="pt-5 text-center">Private</h1>
        <p className="lead text-center">Update Profile</p>
        {updateForm}
      </div>
    </Layout>
  );
};

export default Private;
