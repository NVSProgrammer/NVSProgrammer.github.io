export function relocate(path, p = 0){
    let target = window;
    for(p < 1; p--;){
        target = target.parent;
    }
    target.location.href = path;
}