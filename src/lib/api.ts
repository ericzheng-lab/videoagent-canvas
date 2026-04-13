const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export async function apiGenerate(payload: any) {
  const res = await fetch(`${API_BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function apiStatus(jobId: string, model: string, type?: string) {
  const url = `${API_BASE}/api/status?jobId=${jobId}&model=${model}${type ? `&type=${type}` : ""}`;
  const res = await fetch(url);
  return res.json();
}

export async function pollStatus(jobId: string, model: string, type?: string, onProgress?: (data: any) => void) {
  const check = async () => {
    const data = await apiStatus(jobId, model, type);
    if (onProgress) onProgress(data);
    
    if (data.status === "completed" || data.status === "SUCCESS" || data.status === "success") {
      return data;
    }
    if (data.status === "failed" || data.status === "failure" || data.status === "error") {
      throw new Error(data.error || data.message || "生成失败");
    }
    
    await new Promise((r) => setTimeout(r, 10000));
    return check();
  };
  return check();
}
