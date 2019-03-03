from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PointSerializer, ImageSerializer
from .models import Point, Image
from django.db.models import Q

@api_view(['post'])
def point_new(request):
    # if not request.user.is_authenticated():
    #     return views.login(request, template_name='osnowa_app/login.html')
    # else:
    if request.method == "POST":

        serializer = PointSerializer(data=request.data)
        if serializer.is_valid():
            # save() zapisuje punkt w bazie danych
            newPoint = serializer.save()

            for image in request.data.getlist('images'):
                newImage = Image(image=image, point=newPoint)
                newImage.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['put'])
def point_edit(request):
    if request.method == "PUT":

        point = Point.objects.get(id=request.data.get('id'))
        serializer = PointSerializer(point, data=request.data)
        if serializer.is_valid():
            # save() zapisuje punkt w bazie danych

            editedPoint = serializer.save()

            for image in request.data.getlist('images'):
                newImage = Image(image=image, point=editedPoint)
                newImage.save()

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['get'])
def point_get(request):
    # wyciąga z bazy danych info o jednym punkcie.

    point = Point.objects.get(id=request.GET['id'])

    serializer1 = PointSerializer(point)
    pictures = Image.objects.all().filter(point_id=request.GET['id'])
    serializer2 = ImageSerializer(pictures, many=True)

    Serializer_list = [serializer1.data, serializer2.data]

    content = {
        'status': 1,
        'responseCode': status.HTTP_200_OK,
        'data': Serializer_list,
    }
    return Response(content)

@api_view(['get'])
def points(request):
    # wyciąga z bazy danych info o wszystkich punktach w aktualnym widoku mapy.

    # gte - grater than or equal
    # lte - less than or equal
    points = Point.objects.all().filter(Y_WGS84__lte=request.GET['north'], Y_WGS84__gte=request.GET['south'], X_WGS84__lte=request.GET['east'], X_WGS84__gte=request.GET['west'])

    # tak serializuję wiele modeli
    pointSerializer = PointSerializer(points, many=True)  # serializer zamienia obiekt Pythonowy na jakiś format, np. JSON

    return Response(pointSerializer.data)


@api_view(['get'])
def point_search(request):
    # wyciąga z bazy danych info o wszystkich punktach spełniajacych warunek wyszukiwania.

    # pola typu varchar(200) - stringi
    points1 = Point.objects.all().filter(
        Q(catalog_number__icontains=request.GET['searchCondition']) |
        Q(controlType__icontains=request.GET['searchCondition']) |
        Q(controlClass__icontains=request.GET['searchCondition']) |
        Q(country__icontains=request.GET['searchCondition']) |
        Q(state__icontains=request.GET['searchCondition']) |
        Q(district__icontains=request.GET['searchCondition']) |
        Q(county__icontains=request.GET['searchCondition']) |
        Q(locality__icontains=request.GET['searchCondition']) |
        Q(city_district__icontains=request.GET['searchCondition']) |
        Q(road__icontains=request.GET['searchCondition']) |
        Q(house_number__icontains=request.GET['searchCondition']) |
        Q(stabilization__icontains=request.GET['searchCondition'])
    )

    try:
        # pola typu real - liczby
        points2 = Point.objects.all().filter(
            Q(X_WGS84__icontains=float(request.GET['searchCondition'])) |
            Q(Y_WGS84__icontains=float(request.GET['searchCondition'])) |
            Q(X_local__icontains=float(request.GET['searchCondition'])) |
            Q(Y_local__icontains=float(request.GET['searchCondition'])) |
            Q(hAmsterdam__icontains=float(request.GET['searchCondition'])) |
            Q(hKronsztadt__icontains=float(request.GET['searchCondition']))
        )
        points = points1 | points2
    except:
        points = points1

    # tak serializuję wiele modeli
    pointSerializer = PointSerializer(points, many=True)  # serializer zamienia obiekt Pythonowy na jakiś format, np. JSON

    return Response(pointSerializer.data)


@api_view(['get'])
def points_search(request):
    # wyciąga z bazy danych info o wszystkich punktach spełniajacych wszystkie warunki wyszukiwania.
    # fields = Point.__meta.get_all_field_names()
    catalogNumber = None
    points = Point.objects.all()
    pointsLocality = Point.objects.all()
    controlType1 = 'null'
    controlType2 = 'null'
    controlType3 = 'null'
    controlType4 = 'null'
    controlTypes = []
    controlClasses = []
    stabilizationWays = []

    if request.GET['controlType1'] == 'true':
        controlTypes.append('pozioma')

    if request.GET['controlType2'] == 'true':
        controlTypes.append('wysokosciowa')

    if request.GET['controlType3'] == 'true':
        controlTypes.append('dwufunkcyjna')

    if request.GET['controlType4'] == 'true':
        controlTypes.append('sytuacyjno-wysokosciowa')

    if request.GET['controlClass1'] == 'true':
        controlClasses.append('1')

    if request.GET['controlClass2'] == 'true':
        controlClasses.append('2')

    if request.GET['controlClass3'] == 'true':
        controlClasses.append('3')

    if request.GET['controlClass4'] == 'true':
        controlClasses.append('pomiarowa')

    if request.GET['stabilization1'] == 'true':
        stabilizationWays.append('słup betonowy')

    if request.GET['stabilization2'] == 'true':
        stabilizationWays.append('słup granitowy lub bazaltowy')

    if request.GET['stabilization3'] == 'true':
        stabilizationWays.append('odlew żeliwny w kształcie ostrosłupa')

    if request.GET['stabilization4'] == 'true':
        stabilizationWays.append('skrzynka z odlewu żeliwnego')

    if request.GET['stabilization5'] == 'true':
        stabilizationWays.append('pal drewniany')

    if request.GET['stabilization6'] == 'true':
        stabilizationWays.append('rura kan. wypełniona cementem')

    if request.GET['stabilization7'] == 'true':
        stabilizationWays.append('słup obserwacyjny')

    if request.GET['stabilization8'] == 'true':
        stabilizationWays.append('reper')

    if request.GET['stabilization9'] == 'true':
        stabilizationWays.append('stacja referencyjna')

    if request.GET['stabilization10'] == 'true':
        stabilizationWays.append('bolec')

    if request.GET['stabilization11'] == 'true':
        stabilizationWays.append('kamień naturalny')

    if request.GET['stabilization12'] == 'true':
        stabilizationWays.append('pręt')

    if request.GET['stabilization13'] == 'true':
        stabilizationWays.append('rurka')

    if request.GET['stabilization14'] == 'true':
        stabilizationWays.append('szczegół terenowy')


    if request.GET['catalogNumber'] != 'null':
        catalogNumber = request.GET['catalogNumber']
        points = points.filter(Q(catalog_number__icontains=catalogNumber))

    if request.GET['controlType1'] == 'true' or request.GET['controlType2'] == 'true' or request.GET['controlType3'] == 'true' or request.GET['controlType4'] == 'true':
        points = points.filter(Q(controlType__in = controlTypes))

    if request.GET['controlClass1'] == 'true' or request.GET['controlClass2'] == 'true' or request.GET['controlClass3'] == 'true' or request.GET['controlClass4'] == 'true':
        points = points.filter(Q(controlClass__in = controlClasses))

    if request.GET['country'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(country__icontains=request.GET['country'])
        )

    if request.GET['state'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(state__icontains=request.GET['state'])
        )

    if request.GET['district'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(district__icontains=request.GET['district'])
        )

    if request.GET['county'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(county__icontains=request.GET['county'])
        )

    if request.GET['locality'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(locality__icontains=request.GET['locality'])
        )

    if request.GET['city_district'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(city_district__icontains=request.GET['city_district'])
        )

    if request.GET['road'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(road__icontains=request.GET['road'])
        )

    if request.GET['house_number'] != 'null':
        pointsLocality = pointsLocality.filter(
            Q(house_number__icontains=request.GET['house_number'])
        )

    if request.GET['stabilization1'] == 'true' or request.GET['stabilization2'] == 'true' or request.GET['stabilization3'] == 'true' or request.GET['stabilization4'] == 'true' or request.GET['stabilization5'] == 'true' or request.GET['stabilization6'] == 'true' or request.GET['stabilization7'] == 'true' or request.GET['stabilization8'] == 'true' or request.GET['stabilization9'] == 'true' or request.GET['stabilization10'] == 'true' or request.GET['stabilization11'] == 'true' or request.GET['stabilization12'] == 'true' or request.GET['stabilization13'] == 'true' or request.GET['stabilization14'] == 'true':
        points = points.filter(Q(stabilization__in = stabilizationWays))

    if request.GET['north'] != 'null' or request.GET['south'] != 'null' or request.GET['east'] != 'null' or request.GET['west'] != 'null':
        points = points.filter(Y_WGS84__lte=request.GET['north'], Y_WGS84__gte=request.GET['south'],
                                        X_WGS84__lte=request.GET['east'], X_WGS84__gte=request.GET['west'])


    points = points & pointsLocality

    # tak serializuję wiele modeli
    pointSerializer = PointSerializer(points, many=True)  # serializer zamienia obiekt Pythonowy na jakiś format, np. JSON

    return Response(pointSerializer.data)




