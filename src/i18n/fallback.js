/**
 * The few strings the loading and error screens need. They live outside src/content/ on purpose: those
 * screens appear exactly when a language's content could not be loaded (a dropped connection, say),
 * so they cannot depend on it. Plain data, so the tests can compare the languages.
 */
export const fallbackText = Object.freeze({
  en: Object.freeze({
    loading: "Loading Web Smith Studio",
    notFoundTitle: "We could not find that page.",
    errorTitle: "Something went wrong.",
    errorText:
      "The page may have moved, or your connection dropped while it was loading. Try again, or head back to the home page.",
    home: "Back to home",
    reload: "Reload this page",
    help: "Still stuck? Contact us",
    errorHeadTitle: "Something went wrong | Web Smith Studio",
  }),
  ka: Object.freeze({
    loading: "იტვირთება Web Smith Studio",
    notFoundTitle: "ეს გვერდი ვერ ვიპოვეთ.",
    errorTitle: "დაფიქსირდა შეცდომა.",
    errorText:
      "გვერდი შესაძლოა გადატანილია, ან ჩატვირთვისას ინტერნეტკავშირი გაითიშა. სცადეთ თავიდან ან დაბრუნდით მთავარ გვერდზე.",
    home: "მთავარ გვერდზე დაბრუნება",
    reload: "გვერდის განახლება",
    help: "კვლავ პრობლემაა? დაგვიკავშირდით",
    errorHeadTitle: "დაფიქსირდა შეცდომა | Web Smith Studio",
  }),
});
