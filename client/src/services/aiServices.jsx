export const getFirstMessage = async ({ language, difficulty, location }) => {
    const requestData = {
      language: language,
      difficulty: difficulty,
      location: location
    };

    console.log('Request Data:', requestData.language);

    try {
      const response = await fetch('http://localhost:8080/api/get__first', {
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
      return responseData;
    } catch (error) {
      console.error('Error:', error);
    }
};

export const getResponse = async (prompt) => {
    const requestData = {
      prompt: prompt
    };

    console.log('Request Data:', requestData.prompt);

    try {
      const response = await fetch('http://localhost:8080/api/get__response', {
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
      return responseData;
    } catch (error) {
      console.error('Error:', error);
    }
};
