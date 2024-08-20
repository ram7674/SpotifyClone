import React, { useEffect, useState } from 'react';

const Home = () => {
    const [accessToken, setAccessToken] = useState("");
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        const fetchToken = async () => {
            const clientId = '876869075d864d4db77c5cb9a16d6900';
            const clientSecret = '00ba8cfd5b1f465c83800a81f49d6712';
            const authHeader = 'Basic ' + btoa(`${clientId}:${clientSecret}`);
            
            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': authHeader,
                    },
                    body: new URLSearchParams({
                        grant_type: 'client_credentials'
                    })
                });

                if (!response.ok) {
                    throw new Error(`Token fetch failed: ${response.statusText}`);
                }

                const data = await response.json();
                setAccessToken(data.access_token);
                fetchTracks(data.access_token); // Fetch tracks using the access token
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchTracks = async (token) => {
            try {
                const response = await fetch('https://api.spotify.com/v1/search?' + new URLSearchParams({
                    q: 'track',
                    type: 'track',
                    limit: 50
                }), {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Track fetch failed: ${response.statusText}`);
                }

                const data = await response.json();
                console.log(data);
                setTracks(data.tracks.items); // Update state with track data
            } catch (error) {
                setError(error.message);
            }
        };

        fetchToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Spotify Tracks</h1>
            {tracks.length > 0 ? (
                <ul>
                    {tracks.map(track => (
                        <li key={track.id}>
                            <strong>{track.name}</strong> by {track.artists.map(artist => artist.name).join(', ')}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No tracks found.</p>
            )}
        </div>
    );
};

export default Home;
