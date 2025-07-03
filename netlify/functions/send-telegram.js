exports.handler = async (event, context) => {
  // Разрешаем CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Обрабатываем preflight запрос
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Проверяем метод запроса
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Парсим данные формы
    const data = JSON.parse(event.body);
    const { name, phone, email, message } = data;

    // Валидация
    if (!name || !phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Имя и телефон обязательны' })
      };
    }

    // Конфигурация Telegram
    const BOT_TOKEN = '7663496694:AAGgiCtObnpNgwQ_nU_26EsCQJ_7arJ2fkU';
    const CHAT_ID = '@luxconstructionleads';

    // Формируем сообщение
    const telegramMessage = `🏗️ Новая заявка с сайта LUX Construction

👤 Имя: ${name}
📞 Телефон: ${phone}${email ? `\n📧 Email: ${email}` : ''}${message ? `\n💬 Сообщение: ${message}` : ''}

⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
🌐 Источник: luxconstruction.kz`;

    // Отправляем в Telegram
    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    const result = await response.json();

    if (result.ok) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Заявка успешно отправлена!' 
        })
      };
    } else {
      console.error('Telegram API error:', result);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Ошибка отправки в Telegram',
          details: result.description 
        })
      };
    }

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Внутренняя ошибка сервера',
        details: error.message 
      })
    };
  }
};

