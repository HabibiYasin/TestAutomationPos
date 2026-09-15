Feature: Login Pengguna

  Scenario Outline: Login pengguna berdasarkan role
    Given pengguna berada di halaman login
    When pengguna login dengan email "<email>" dan password "<password>"
    Then pengguna diarahkan ke dashboard "<dashboard>"

    Examples:
      | role  | email                | password  | dashboard                                      |
      | kasir | kasir1@gmail.com     | kasir1123 | https://pos.habibiyasin.my.id/kasir/dashboard  |
      | koki  | koki@gmail.com       | koki1123  | https://pos.habibiyasin.my.id/koki/dashboard   |
      | admin | adminresto@gmail.com | admin123  | https://pos.habibiyasin.my.id/admin/dashboard |

  Scenario: Login ditolak dengan email tidak valid dan password valid
    Given pengguna berada di halaman login
    When pengguna login dengan email "email-tidak-valid@example.com" dan password "kasir1123"
    Then sistem menolak login dan menampilkan pesan kredensial salah