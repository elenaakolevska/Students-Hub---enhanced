import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AuthProvider from './providers/authProvider';
import Navigation from './ui/Navigation';
import Footer from './ui/Footer';

import Home from './ui/pages/Home';
import Login from './ui/pages/Login';
import Register from './ui/pages/Register';
import About from './ui/pages/About';
import Chat from './ui/pages/Chat';
import Favorites from './ui/pages/Favorites';
import MyPosts from './ui/pages/MyPosts';

import EventPostList from './ui/components/events/EventPostList';
import EventPostDetails from './ui/components/events/EventPostDetails';
import EventPostForm from './ui/components/events/EventPostForm';

import HousingPostList from './ui/components/housing/HousingPostList';
import HousingPostDetails from './ui/components/housing/HousingPostDetails';
import HousingPostForm from './ui/components/housing/HousingPostForm';

import InternshipPostList from './ui/components/internship/InternshipPostList';
import InternshipPostDetails from './ui/components/internship/InternshipPostDetails';
import InternshipPostForm from './ui/components/internship/InternshipPostForm';

import MaterialPostList from './ui/components/materials/MaterialPostList';
import MaterialPostDetails from './ui/components/materials/MaterialPostDetails';
import MaterialPostForm from './ui/components/materials/MaterialPostForm';

import TransportPostList from './ui/components/transport/TransportPostList';
import TransportPostDetails from './ui/components/transport/TransportPostDetails';
import TransportPostForm from './ui/components/transport/TransportPostForm';

import TutorPostList from './ui/components/tutor/TutorPostList';
import TutorPostDetails from './ui/components/tutor/TutorPostDetails';
import TutorPostForm from './ui/components/tutor/TutorPostForm';

import ProtectedRoute from './ui/components/auth/ProtectedRoute';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navigation />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />

              <Route path="/events" element={<EventPostList />} />
              <Route path="/event-posts/:id" element={<EventPostDetails />} />
              <Route path="/event-posts/create" element={<ProtectedRoute><EventPostForm /></ProtectedRoute>} />
              <Route path="/event-posts/:id/edit" element={<ProtectedRoute><EventPostForm /></ProtectedRoute>} />

              <Route path="/housing" element={<HousingPostList />} />
              <Route path="/housing-posts/:id" element={<HousingPostDetails />} />
              <Route path="/housing-posts/create" element={<ProtectedRoute><HousingPostForm /></ProtectedRoute>} />
              <Route path="/housing-posts/:id/edit" element={<ProtectedRoute><HousingPostForm /></ProtectedRoute>} />

              <Route path="/internships" element={<InternshipPostList />} />
              <Route path="/internship-posts/:id" element={<InternshipPostDetails />} />
              <Route path="/internship-posts/create" element={<ProtectedRoute><InternshipPostForm /></ProtectedRoute>} />
              <Route path="/internship-posts/:id/edit" element={<ProtectedRoute><InternshipPostForm /></ProtectedRoute>} />

              <Route path="/materials" element={<MaterialPostList />} />
              <Route path="/material-posts/:id" element={<MaterialPostDetails />} />
              <Route path="/material-posts/create" element={<ProtectedRoute><MaterialPostForm /></ProtectedRoute>} />
              <Route path="/material-posts/:id/edit" element={<ProtectedRoute><MaterialPostForm /></ProtectedRoute>} />

              <Route path="/transport" element={<TransportPostList />} />
              <Route path="/transport-posts/:id" element={<TransportPostDetails />} />
              <Route path="/transport-posts/create" element={<ProtectedRoute><TransportPostForm /></ProtectedRoute>} />
              <Route path="/transport-posts/:id/edit" element={<ProtectedRoute><TransportPostForm /></ProtectedRoute>} />

              <Route path="/tutors" element={<TutorPostList />} />
              <Route path="/tutor-posts/:id" element={<TutorPostDetails />} />
              <Route path="/tutor-posts/create" element={<ProtectedRoute><TutorPostForm /></ProtectedRoute>} />
              <Route path="/tutor-posts/:id/edit" element={<ProtectedRoute><TutorPostForm /></ProtectedRoute>} />

              <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/chat/:username" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
              <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
              <Route path="/my-posts" element={<ProtectedRoute><MyPosts /></ProtectedRoute>} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
