---
title: Rust - język poziomu systemowego w moim guście
date: 2020-01-02
published: true
categories: języki komputerowe, rust, react
---

Kilka lat temu za czasów technikum, kolega z klasy zaczepił mnie i zapytał czy słyszałęm o tkaim śmiesznym języku "Rust" tj. rdza.
Na tamten czas jednak w zasadzie poza przeglądarką mało co mnie interesowało więc odpowiedziałem ze nie.
Wspólnie popatrzeliśmy na śmieszności i dziwadztwa tego języka -- jak to nastoleni specjaliści.

Teraz jednak (a w zasadzie kilka miesięcy temu) gdy rozpocząłem czytanie [tutorialo-dokumentacji](https://doc.rust-lang.org/book/)
stałem się wielkim fanem tego języka. Samo czytanie tej "książki" było dla mnie przyjemnością a odkrywanie kolejnych elementów języka
i tego dlaczego są one napisane tak a nie inaczej przyprawiało mnie o zdumienie.

## Dlaczego Rust a nie C++

Zanim powstał Rust, niepokonanym królem był C++ (królem wydajnościowym przy obiektowym, zrozumiałym wydaniu).
Jako że ja poznałem C++ po wielu latach od jego wydania, i po tym gdy znałem (po prostu znałem; niekoniecznie dobrze)
już takie języki jak chociażby JS, python, Java, SQL, to taki C++ wydawał mi się dobitnie zaznaczać swoją starość.
Dla mnie, język ten jest nieprzyjemny ponieważ trzeba zadbać o wiele rzeczy które inne języki (czy też ich srodowisko) robią samodzielnie. Tak dla przykładu:
 * [przepełnienie bufora](https://en.wikipedia.org/wiki/Buffer_overflow) ([pl](https://pl.wikipedia.org/wiki/Przepełnienie_bufora))
 * [wycieki pamięci](https://en.wikipedia.org/wiki/Memory_leak) ([pl](https://pl.wikipedia.org/wiki/Wyciek_pamięci)) -- brak garbage collectora :kot:
 * [podwójna dealokacja](https://stackoverflow.com/questions/21057393/what-does-double-free-mean) (znalazłem tylko z angielska)
 * [naruszenie bezpieczeństwa pamięci](https://en.wikipedia.org/wiki/Segmentation_fault) ([pl](https://pl.wikipedia.org/wiki/Naruszenie_ochrony_pamięci)) -- np. odwołanie do nulla

Do powyższej listy dodałbym także składnię (nie jest kwestią bezpieczeństwa, stąd umieszczam poza listą),
która wygląda jak materiał z wieloma łatami -- tak jakby dodawano ją bez namyślunku).
Jako, ze lubuję się w językach (nazwijmy to) nowoczesnych,
to ilosć rzeczy o których trzeba pamiętać jak i niewygodna składnia skutecznie mnie zniechęcają.

W kontrze (jak sie tego można było spodziewać) staje Rust.
Tak jak C++ jest to *[system programming language](https://en.wikipedia.org/wiki/System_programming_language)*,
czyli w skrócie jest to język wydajny o dużych możliwosciach. Każdy z przytoczonych problemów rozwiązuje już w czasie kompilacji. Aby podsycić ciekawość dodam, ze jest to język obiektowy a nie posiada klas :O, nulli :O, ani bloku try/catch :O.