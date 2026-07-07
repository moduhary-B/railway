import fs from 'fs';
import path from 'path';

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  source: string;
  data?: any;
  requestId?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(entry: LogEntry) {
    const logFile = path.join(this.logDir, `${entry.source}.log`);
    const logLine = JSON.stringify(entry) + '\n';
    
    try {
      fs.appendFileSync(logFile, logLine);
      
      // Также отправляем в WebSocket если доступен
      this.broadcastToWebSocket(entry);
    } catch (error) {
      console.error('Error writing log:', error);
    }
  }

  private broadcastToWebSocket(entry: LogEntry) {
    try {
      // Импортируем функцию broadcastLog из WebSocket модуля
      const { broadcastLog } = require('../app/api/logs/websocket/route');
      if (broadcastLog) {
        broadcastLog(entry);
      }
    } catch (error) {
      // Игнорируем ошибки WebSocket
    }
  }

  private createEntry(level: LogEntry['level'], message: string, source: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      source,
      data,
      requestId: Math.random().toString(36).substr(2, 9)
    };
  }

  debug(message: string, source: string = 'api', data?: any) {
    const entry = this.createEntry('debug', message, source, data);
    this.writeLog(entry);
  }

  info(message: string, source: string = 'api', data?: any) {
    const entry = this.createEntry('info', message, source, data);
    this.writeLog(entry);
  }

  warn(message: string, source: string = 'api', data?: any) {
    const entry = this.createEntry('warn', message, source, data);
    this.writeLog(entry);
  }

  error(message: string, source: string = 'api', data?: any) {
    const entry = this.createEntry('error', message, source, data);
    this.writeLog(entry);
  }

  // Специальные методы для разных типов логов
  apiRequest(method: string, url: string, params?: any, response?: any) {
    this.info(`API Request: ${method} ${url}`, 'api', {
      method,
      url,
      params,
      response: response ? { status: response.status, data: response.data } : undefined
    });
  }

  parserLog(message: string, data?: any) {
    this.info(message, 'parser', data);
  }

  databaseLog(message: string, data?: any) {
    this.info(message, 'database', data);
  }

  errorLog(message: string, error?: any) {
    this.error(message, 'errors', {
      error: error?.message || error,
      stack: error?.stack
    });
  }
}

export const logger = new Logger(); 