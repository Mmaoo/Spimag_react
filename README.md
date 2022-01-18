Aplikacja - domowa spiżarnia

Api (./api) jest zrobione w Spring Boot jako Rest api
Frontend (./client) jest zrobione wykorzystując React
Baza danych jest przygotowana na systemie MySQL

Przed uruchomieniem należy pobrać pakiety react:
- przejść do katalogu ./client
- wykonać polecenie npm install

Aplikacja pozwala na rejestracje i logowanie.
Po zalogowaniu możliwa jest edycja danych oraz przegląd własnych przetworów.
Po wybraniu wiersza wyświetlają się dane wybranego elementu,
możliwa jest szybka edycja liczby przedmiotów
oraz możliwa jest szczegółowa edycja danych
Po kliknięciu na nazwę obszaru w liście, dane zostają filtrowane tylko do wybranego obszaru

Wszystkie dane są walidowane wykorzystując adnotacje w klasie encji
Walidacja jest przeprowadzana w serwisach wykorzystując domyślny Validator
Elementy api są zabezpieczone przed nieuprawnionym dostępem dla niezalogowanych
oraz osób nieodpowiednich (nie można zmienić danych innego użytkownika)