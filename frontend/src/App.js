import InternshipPostList from './ui/components/internship/InternshipPostList';
import InternshipPostDetails from './ui/components/internship/InternshipPostDetails';
import InternshipPostForm from './ui/components/internship/InternshipPostForm';
import TransportPostList from './ui/components/transport/TransportPostList';
import TransportPostDetails from './ui/components/transport/TransportPostDetails';
import TransportPostForm from './ui/components/transport/TransportPostForm';
import HousingPostList from './ui/components/housing/HousingPostList';
import HousingPostDetails from './ui/components/housing/HousingPostDetails';
import HousingPostForm from './ui/components/housing/HousingPostForm';
import MaterialPostList from './ui/components/materials/MaterialPostList';
import MaterialPostDetails from './ui/components/materials/MaterialPostDetails';
import MaterialPostForm from './ui/components/materials/MaterialPostForm';
import TutorPostList from './ui/components/tutor/TutorPostList';
import TutorPostDetails from './ui/components/tutor/TutorPostDetails';
import TutorPostForm from './ui/components/tutor/TutorPostForm';

import EventPostList from './ui/components/events/EventPostList';
import EventPostDetails from './ui/components/events/EventPostDetails';
import React, { useEffect, useState } from 'react';
import Navigation from './ui/Navigation';
import eventPostRepository from './repository/eventPostRepository';
import { Routes, Route } from 'react-router-dom';
import Home from './ui/pages/Home';
import Chat from './ui/pages/Chat';
import Login from './ui/pages/Login';
import Register from './ui/pages/Register';
import About from './ui/pages/About';
import MyPosts from './ui/pages/MyPosts';


function App() {
  const [eventPosts, setEventPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await eventPostRepository.findAll();
        setEventPosts(res.data);
      } catch (err) {
        setError('Грешка при вчитување на настаните');
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/event-posts" element={
          loading ? (
            <div className="container my-5 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Вчитување...</span>
              </div>
            </div>
          ) : error ? (
            <div className="container my-5">
              <div className="alert alert-danger" role="alert">{error}</div>
            </div>
          ) : (
            <EventPostList eventPosts={eventPosts} />
          )
        } />
        <Route path="/event-posts/:id" element={<EventPostDetails />} />
        {/* Internship posts */}
        <Route path="/internship-posts" element={<InternshipPostList />} />
        <Route path="/internship-posts/create" element={<InternshipPostForm />} />
        <Route path="/internship-posts/edit/:id" element={<InternshipPostForm />} />
        <Route path="/internship-posts/:id" element={<InternshipPostDetails />} />

        {/* Transport posts */}
        <Route path="/transport-posts" element={<TransportPostList />} />
        <Route path="/transport-posts/create" element={<TransportPostForm />} />
        <Route path="/transport-posts/edit/:id" element={<TransportPostForm />} />
        <Route path="/transport-posts/:id" element={<TransportPostDetails />} />

        {/* Housing posts */}
        <Route path="/housing-posts" element={<HousingPostList />} />
        <Route path="/housing-posts/create" element={<HousingPostForm />} />
        <Route path="/housing-posts/edit/:id" element={<HousingPostForm />} />
        <Route path="/housing-posts/:id" element={<HousingPostDetails />} />

        {/* Material posts */}
        <Route path="/material-posts" element={<MaterialPostList />} />
        <Route path="/material-posts/create" element={<MaterialPostForm />} />
        <Route path="/material-posts/edit/:id" element={<MaterialPostForm />} />
        <Route path="/material-posts/:id" element={<MaterialPostDetails />} />

        {/* Tutor posts */}
        <Route path="/tutor-posts" element={<TutorPostList />} />
        <Route path="/tutor-posts/create" element={<TutorPostForm />} />
        <Route path="/tutor-posts/edit/:id" element={<TutorPostForm />} />
        <Route path="/tutor-posts/:id" element={<TutorPostDetails />} />
      </Routes>
    </>
  );
}

export default App;
