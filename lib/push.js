/**
 * Web Push subscription helpers.
 * Call `subscribeToPush(token)` once after the user logs in.
 */

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

export async function subscribeToPush(authToken) {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const reg = await navigator.serviceWorker.ready

    // Fetch VAPID public key from backend
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/notifications/vapid-public-key`
    )
    const { key } = await res.json()
    if (!key) return

    // Subscribe with VAPID key
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(key),
    })

    const { endpoint, keys } = subscription.toJSON()

    // Send to backend
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        endpoint,
        p256dh: keys.p256dh,
        auth:   keys.auth,
      }),
    })
  } catch {
    // Push not supported or denied — silently ignore
  }
}

export async function unsubscribeFromPush(authToken) {
  try {
    if (!('serviceWorker' in navigator)) return
    const reg = await navigator.serviceWorker.ready
    const sub = await reg.pushManager.getSubscription()
    if (!sub) return

    const { endpoint } = sub.toJSON()
    await sub.unsubscribe()

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notifications/subscribe`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ endpoint }),
    })
  } catch {
    // Silently ignore
  }
}
