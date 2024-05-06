const [response, setResponse] = useState(null);

export const getFirstMessage = async ({ language, difficulty, location }) => {
    const requestData = {
      language: language,
      difficulty: difficulty,
      location: location
    };

    try {
      const response = await fetch('http://localhost:8080/api/get_response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      setResponse(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

