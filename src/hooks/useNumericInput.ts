import { useState, useEffect } from 'react';

/**
 * Custom Hook que gestiona el estado y la validación de un campo de texto numérico.
 * 
 * Centraliza la lógica de sanitización de entrada, garantizando 
 * que el usuario solo pueda introducir caracteres numéricos válidos. Implementa un 
 * mecanismo de limitación para restringir el valor máximo permitido si se especifica.
 * 
 * @param {number} value - El valor numérico base sincronizado con la fuente de la verdad (ej. estado global).
 * @param {number | undefined} maxValue - (Opcional) Límite superior permitido. Si no se define, el valor no tiene tope.
 * @param {(val: number) => void} onChange - Callback que emite el valor resultante tras el proceso de validación.
 * @returns {Object} Estado local de texto y manejadores de eventos diseñados para un componente `<TextInput>`.
 */
export const useNumericInput = (
  value: number, 
  maxValue: number | undefined, 
  onChange: (val: number) => void
) => {
  const [textValue, setTextValue] = useState(value.toString());

  useEffect(() => {
    if (parseInt(textValue || '0', 10) === value) return;
    setTextValue(value.toString());
  }, [value]);

  const handleBlur = () => {
    if (textValue === '') {
      setTextValue('0');
      onChange(0);
    }
  };

  const handleTextChange = (val: string) => {
    const cleanText = val.replace(/[^0-9]/g, '');

    if (cleanText === '') {
      setTextValue('');
      onChange(0);
      return;
    }

    let parsed = parseInt(cleanText, 10);
    if (isNaN(parsed)) parsed = 0;

    if (maxValue !== undefined && parsed > maxValue) {
      parsed = maxValue;
    }

    setTextValue(parsed.toString());
    onChange(parsed);
  };

  return { textValue, handleTextChange, handleBlur };
};