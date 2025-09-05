export async function fetchAnalysis(file: File) {
  const base64 = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  }).then((data) => data.split(',')[1]);

  const response = await fetch('/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: base64, filename: file.name }),
  });

  if (!response.ok) {
    const error: any = new Error(`HTTP error! status: ${response.status}`);
    error.response = response;
    throw error;
  }

  return response.json();
}
