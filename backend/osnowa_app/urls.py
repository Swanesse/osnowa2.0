from django.conf.urls import url
from . import views
from django.views.generic import RedirectView

app_name='osnowa_app'
urlpatterns = [

    # url(r'^$', views.point_list, name='point_list'),
    # link ma prowadzić do strony ze szczegółami o punkcie .com/point/2/
    # url(r'^point/(?P<pk>[0-9]+)/$', views.point_detail, name='point_detail'),
    url(r'^points/$', views.points, name='points'),


    # link do formularza tworzenia nowego punktu
    url(r'^point/new$', views.point_new, name='point_new'),

    url(r'^point/get$', views.point_get, name='point_get'),

    # Wyświetlenie punktów z bazy na mapie
    url(r'^point/view$', views.points, name='points'),

    #
    # # edycja formularza
    # url(r'^point/(?P<pk>[0-9]+)/edit/$', views.point_edit, name='point_edit'),
    # # link do formularza logowania
    # url(r'^login/user/$', views.login_user, name='login_user'),
    #
    # # Wylogowanie użytkownika
    # url(r'^logout/user/$', views.logout_user, name='logout_user'),
    #
    # url(r'^user/$', views.user, name='user'),
    #
    # url(r'^one/$', RedirectView.as_view(url='/another/')),
    #
    # url(r'^register/$', views.register, name='register'),
    #
    # url(r'^search/$', views.search, name='search'),
    #
    # url(r'^informacje/$', views.informacje, name='informacje'),
    #
    # url(r'^kontakt/$', views.kontakt, name='kontakt'),

]
