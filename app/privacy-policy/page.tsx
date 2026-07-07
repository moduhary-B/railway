import Link from "next/link"
import { Check } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#0e1720] text-gray-200">
      <main className="container mx-auto px-4 py-16 max-w-4xl pt-32">
        <Link href="/" className="inline-flex items-center text-sm font-medium text-[#c9a86e] hover:text-[#d4b876] mb-8 transition-colors">
          &larr; На главную
        </Link>
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-[#c9a86e]/30 pb-4">Политика конфиденциальности и обработки персональных данных</h1>

        <div className="space-y-6 prose prose-invert max-w-none">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Общие положения</h2>
            <p className="text-gray-400">Настоящая политика обработки персональных данных составлена в соответствии с требованиями Федеральный закон №152-ФЗ и определяет порядок обработки персональных данных и меры по обеспечению безопасности персональных данных, предпринимаемые Туров Павел Александрович (далее — Оператор).</p>
            <p className="text-gray-400">Оператор ставит своей важнейшей целью соблюдение прав и свобод человека при обработке его персональных данных.</p>
            <p className="text-gray-400">Настоящая политика применяется ко всей информации, которую Оператор может получить о посетителях сайта orientavto.com.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Основные понятия</h2>
            <p className="text-gray-400">Персональные данные — любая информация, относящаяся прямо или косвенно к определенному Пользователю.</p>
            <p className="text-gray-400">Обработка персональных данных — любое действие с персональными данными (сбор, хранение, использование и т.д.).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Персональные данные, которые обрабатываются</h2>
            <p className="text-gray-400">Оператор может обрабатывать следующие персональные данные:</p>
            <ul className="list-none pl-0 space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> ФИО</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Номер телефона</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Адрес электронной почты</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Иные данные, которые пользователь добровольно указывает в формах сайта</li>
            </ul>
            <p className="text-gray-400 mt-4">Также на сайте происходит сбор обезличенных данных о посетителях (в том числе файлов cookie) с помощью сервисов интернет-статистики.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Цели обработки персональных данных</h2>
            <p className="text-gray-400">Персональные данные пользователя обрабатываются в целях:</p>
            <ul className="list-none pl-0 space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Обратной связи с пользователем</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Обработки заявок и обращений</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Предоставления информации об услугах</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Правовые основания обработки</h2>
            <p className="text-gray-400">Оператор обрабатывает персональные данные пользователя только в случае их заполнения и/или отправки пользователем самостоятельно через формы на сайте.</p>
            <p className="text-gray-400">Отправляя данные, пользователь выражает согласие с настоящей Политикой.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Порядок обработки и хранения данных</h2>
            <p className="text-gray-400">Оператор обеспечивает сохранность персональных данных и принимает все возможные меры для исключения доступа к ним неуполномоченных лиц.</p>
            <p className="text-gray-400">Персональные данные пользователя не передаются третьим лицам, за исключением случаев, предусмотренных законодательством.</p>
            <p className="text-gray-400">Срок обработки персональных данных — до достижения целей обработки или до отзыва согласия пользователем.</p>
            <p className="text-gray-400 font-semibold mt-4">Все фотографии людей, используемые на сайте, публикуются с их письменного согласия.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Трансграничная передача данных</h2>
            <p className="text-gray-400">Оператор может осуществлять трансграничную передачу персональных данных в случае использования сервисов аналитики и других сторонних сервисов.</p>
            <p className="text-gray-400">Используя сайт, пользователь соглашается с такой передачей.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Файлы cookie</h2>
            <p className="text-gray-400">Сайт использует cookie для корректной работы и улучшения пользовательского опыта.</p>
            <p className="text-gray-400">Пользователь может отключить cookie в настройках браузера.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Права пользователя</h2>
            <p className="text-gray-400">Пользователь имеет право:</p>
            <ul className="list-none pl-0 space-y-2 text-gray-400">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Получать информацию о своих персональных данных</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Требовать уточнения, блокировки или удаления данных</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-[#c9a86e]" /> Отозвать согласие на обработку</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Заключительные положения</h2>
            <p className="text-gray-400">Пользователь может получить любые разъяснения по вопросам обработки персональных данных, обратившись к Оператору по электронной почте orient.cars@mail.ru.</p>
            <p className="text-gray-400">Настоящая политика действует бессрочно до замены новой версией.</p>
          </section>
        </div>
      </main>

      <footer className="py-12 bg-[#0a0f1a] border-t border-[#c9a86e]/20 text-center">
        <div className="container mx-auto px-4">
          <p className="text-white/50 text-sm">© 2026 Orient Auto. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
