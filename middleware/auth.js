export default function({ store, redirect, route }) {
  if (!store.state.user || !store.state.user.email) {
    return redirect('/login')
  }
}
