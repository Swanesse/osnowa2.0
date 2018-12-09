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
    # fields = Point.__meta.get_all_field_names()

    points1 = Point.objects.all().filter(Q(state=request.GET['searchCondition']) | Q(district=request.GET['searchCondition']) | Q(country=request.GET['searchCondition']))
    # points = Point.objects.all().filter(X_local=float(request.GET['searchCondition']))
    # points = Point.objects.all().filter()

    try:
        float(request.GET['searchCondition'])
        print('True')
        points2 = (Point.objects.all().filter(Q(X_WGS84=float(request.GET['searchCondition'])) | Q(Y_WGS84=float(request.GET['searchCondition'])) | Q(X_local=float(request.GET['searchCondition'])) | Q(Y_local=float(request.GET['searchCondition'])) | Q(hAmsterdam=float(request.GET['searchCondition'])) | Q(hKronsztadt=float(request.GET['searchCondition']))))
        points = points1 | points2
    except:
        print('False')
        points = points1

    # tak serializuję wiele modeli
    pointSerializer = PointSerializer(points, many=True)  # serializer zamienia obiekt Pythonowy na jakiś format, np. JSON

    return Response(pointSerializer.data)


@api_view(['get'])
def points_search(request):
    # wyciąga z bazy danych info o wszystkich punktach spełniajacych wszystkie warunki wyszukiwania.
    # fields = Point.__meta.get_all_field_names()
    print('--------------------------------------------------------')
    print(request.GET['catalogNumber'])
    print('--------------------------------------------------------')
    controlType1 = 'null'
    controlType2 = 'null'
    controlType3 = 'null'
    if request.GET['controlType1'] == 'true':
        controlType1 = 'pozioma'

    if request.GET['controlType2'] == 'true':
        controlType2 = 'wysokosciowa'

    if request.GET['controlType3'] == 'true':
        controlType3 = 'dwufunkcyjna'

    points = Point.objects.all().filter(Q(catalog_number=request.GET['catalogNumber']) & (Q(controlType=controlType1) | Q(controlType=controlType2) | Q(controlType=controlType3) | Q(controlType='null')))
    # points = Point.objects.all().filter(X_local=float(request.GET['searchCondition']))
    # points = Point.objects.all().filter()

    # tak serializuję wiele modeli
    pointSerializer = PointSerializer(points, many=True)  # serializer zamienia obiekt Pythonowy na jakiś format, np. JSON

    return Response(pointSerializer.data)



