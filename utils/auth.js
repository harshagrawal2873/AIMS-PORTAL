export async function handleLogout() {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        // Redirect to index with success message in query parameter
        window.location.href = '/login?message=logout-success';
      } else {
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      alert('An error occurred while logging out.');
    }
  }
  