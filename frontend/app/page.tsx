"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  bio: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const fullUrl = `${apiUrl}/api/v1/users/1`;
    
    console.log("Fetching from:", fullUrl);
    
    axios.get(fullUrl)
      .then(res => {
        console.log("User data received:", res.data);
        setUser(res.data);
        setLoading(false);
        setError(null);
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        console.error("Error details:", err.response?.data || err.message);
        setError(`Failed to load user data: ${err.message}`);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      padding: '40px 20px',
      backgroundColor: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#333',
          borderBottom: '3px solid #0070f3',
          paddingBottom: '15px'
        }}>
          👤 User Profile
        </h1>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{
              display: 'inline-block',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #0070f3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '20px'
            }}></div>
            <p style={{ color: '#666', fontSize: '18px' }}>Loading user data...</p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '8px',
            padding: '20px',
            marginBottom: '20px',
            color: '#c33'
          }}>
            <strong>❌ Error:</strong> {error}
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#999' }}>
              API URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}
            </div>
          </div>
        )}

        {user && !loading && !error && (
          <div style={{
            backgroundColor: '#f9f9f9',
            padding: '30px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Name
              </div>
              <div style={{ 
                fontSize: '24px', 
                fontWeight: '600',
                color: '#333'
              }}>
                {user.name}
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Email
              </div>
              <div style={{ 
                fontSize: '18px',
                color: '#0070f3',
                wordBreak: 'break-word'
              }}>
                {user.email}
              </div>
            </div>

            <div>
              <div style={{ 
                fontSize: '14px', 
                color: '#666', 
                marginBottom: '5px',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Bio
              </div>
              <div style={{ 
                fontSize: '16px',
                color: '#555',
                lineHeight: '1.6',
                padding: '15px',
                backgroundColor: 'white',
                borderRadius: '6px',
                border: '1px solid #e0e0e0'
              }}>
                {user.bio || "No bio available"}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
