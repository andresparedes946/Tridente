/**
 * Coordinación de la entrada: el preloader espera a que la escena esté lista
 * y recién entonces dispara la intro (luz + textos). Estado de módulo: una sola página.
 */
type Listener = () => void;

let sceneReady = false;
let introStarted = false;
const readyListeners = new Set<Listener>();
const introListeners = new Set<Listener>();

export function markSceneReady() {
  if (sceneReady) return;
  sceneReady = true;
  readyListeners.forEach((fn) => fn());
  readyListeners.clear();
}

export function onSceneReady(fn: Listener): () => void {
  if (sceneReady) {
    fn();
    return () => {};
  }
  readyListeners.add(fn);
  return () => readyListeners.delete(fn);
}

export function startIntro() {
  if (introStarted) return;
  introStarted = true;
  introListeners.forEach((fn) => fn());
  introListeners.clear();
}

export function onIntroStart(fn: Listener): () => void {
  if (introStarted) {
    fn();
    return () => {};
  }
  introListeners.add(fn);
  return () => introListeners.delete(fn);
}
