import React from "react";

export default function TermsOfUse() {
  return (
    <div className="container mx-auto px-4 py-16 text-white max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Условия использования</h1>
      <h2 className="text-xl font-semibold mt-8 mb-2">1. Общие положения</h2>
      <p className="mb-4">1.1. Настоящие Условия использования регулируют отношения между Администрацией сайта orientavto.com и пользователем.</p>
      <p className="mb-4">1.2. Используя сайт, пользователь соглашается с настоящими условиями.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">2. Права и обязанности сторон</h2>
      <p className="mb-4">2.1. Пользователь обязуется не предпринимать действий, способных привести к нарушению работы сайта.</p>
      <p className="mb-4">2.2. Администрация сайта вправе изменять содержание сайта, приостанавливать или прекращать его работу.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">3. Ответственность</h2>
      <p className="mb-4">3.1. Администрация сайта не несёт ответственности за возможные убытки, возникшие в результате использования или невозможности использования сайта.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">4. Интеллектуальная собственность</h2>
      <p className="mb-4">4.1. Все объекты, размещённые на сайте, являются объектами авторского права и иных прав.</p>
      <p className="mb-4">4.2. Использование материалов сайта допускается только с согласия правообладателя.</p>
      <h2 className="text-xl font-semibold mt-8 mb-2">5. Изменение условий</h2>
      <p className="mb-4">5.1. Администрация сайта вправе изменять настоящие условия в любое время.</p>
      <p className="mb-4">5.2. Изменения вступают в силу с момента публикации на сайте.</p>
      <p className="mt-8 text-sm text-white/60">Дата последнего обновления: {new Date().toLocaleDateString('ru-RU')}</p>
    </div>
  );
} 