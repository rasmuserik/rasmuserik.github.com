define ['jquery'], ($)->
  console.log [($ x.firstChild).text().trim() for x in ($ 'li')]
