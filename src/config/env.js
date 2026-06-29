// Функция для получения переменных окружения (работает везде)
const getEnvVar = (key) => {
  // Для Create React App
  if (process.env[`REACT_APP_${key}`]) {
    return process.env[`REACT_APP_${key}`]
  }
  // Для Next.js
  if (process.env[`NEXT_PUBLIC_${key}`]) {
    return process.env[`NEXT_PUBLIC_${key}`]
  }
  // Для Node.js (без префиксов)
  if (process.env[key]) {
    return process.env[key]
  }
  // Для Vite (если вдруг)
  if (typeof import.meta !== 'undefined' && import.meta.env?.[`VITE_${key}`]) {
    return import.meta.env[`VITE_${key}`]
  }
  // Fallback: переменная не найдена
  console.warn(`⚠️ Переменная окружения ${key} не найдена`)
  console.log(process.env)
  return ''
}

// Определяем, локальное ли окружение
const isLocal = () => {
  if (typeof window === 'undefined') return false
  const url = window.location.href
  return url.includes('localhost') || url.includes('//10.54')
}

// Флаг локального окружения
const LOCAL = isLocal()

// Конфигурация
export const config = {
  // API URL
  apiUrl: LOCAL
    ? getEnvVar('REACT_APP_API_URL_LOCAL')
    : getEnvVar('API_URL'),
  
  // HMC DNR URL
  hmcDnrUrl: LOCAL
    ? getEnvVar('REACT_APP_HMC_DNR_URL_LOCAL')
    : getEnvVar('HMC_DNR_URL'),
  
  // SOAP API URL
  soapApiUrl: LOCAL
    ? getEnvVar('REACT_APP_SOAP_API_URL_LOCAL')
    : getEnvVar('SOAP_API_URL'),
  
  // Другие URL
  otherApiUrl: getEnvVar('OTHER_API_URL'),
  
  // Вспомогательные флаги
  isLocal: LOCAL,
}

export default config