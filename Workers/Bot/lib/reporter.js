reportTransition(lifecycle) {
  console.log(`Reporting | Transition: ${lifecycle.transition} from: ${lifecycle.from} to: ${lifecycle.to}`)

  http.post('./report', {
    bot: this.id,
    state: lifecycle.to
  })

    .then((response) => {
      if (response.status !== 200) {
        this.sm.bigRedButton(new Error(`Server responded with ${response.status}, expecting 200`));
      }
    })

    .catch((err) => this.sm.bigRedButton(err));
}
