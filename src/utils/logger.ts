// Simple logger wrapper that silences logs in production by default.
// You can enable logs in production by setting VITE_ENABLE_LOGS=true
const env = (import.meta as any).env || {}
const enabled = (!env.PROD) || env.VITE_ENABLE_LOGS === 'true'

export function log(...args: any[]) {
    if (enabled) console.log(...args)
}

export function info(...args: any[]) {
    if (enabled) console.info(...args)
}

export function warn(...args: any[]) {
    if (enabled) console.warn(...args)
}

export function error(...args: any[]) {
    if (enabled) console.error(...args)
}

export function debug(...args: any[]) {
    if (enabled && (env.VITE_ENABLE_DEBUG === 'true' || !env.PROD)) console.debug(...args)
}

export default { log, info, warn, error, debug }
