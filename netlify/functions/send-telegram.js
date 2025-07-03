exports.handler = async (event, context) => {
  // Разрешаем CORS для всех доменов
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Обработка preflight запроса
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
    // Парсим данные из запроса
    const data = JSON.parse(event.body);
    const { name, phone, email, message } = data;

    // Валидация обязательных полей
    if (!name || !phone) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Name and phone are required' })
      };
    }

    // Конфигурация Telegram
    const TELEGRAM_BOT_TOKEN = '7663496694:AAGgiCtObnpNgwQ_nU_26EsCQJ_7arJ2fkU';
    const TELEGRAM_CHAT_ID = '@luxconstructionleads';

    // Формируем сообщение для Telegram
    const telegramMessage = `🏗️ Новая заявка с сайта LUX Construction

👤 Имя: ${name}
📞 Телефон: ${phone}${email ? `\n📧 Email: ${email}` : ''}${message ? `\n💬 Сообщение: ${message}` : ''}

⏰ Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })}
🌐 Источник: luxconstruction.kz`;

    // Отправляем сообщение в Telegram
    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    const telegramResult = await response.json();

    if (!response.ok) {
      console.error('Telegram API error:', telegramResult);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to send message to Telegram',
          details: telegramResult 
        })
      };
    }

    // Успешный ответ
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Message sent successfully',
        telegramMessageId: telegramResult.result.message_id
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      })
    };
  }
};

