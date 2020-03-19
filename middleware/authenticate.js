export default function auth({ redirect }) {
    if (!localStorage.SessionId) {
        return redirect('/');
    }
}