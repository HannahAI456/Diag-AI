import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableOpacity,
  Text,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Geocoder from 'react-native-geocoding';
import Geolocation from '@react-native-community/geolocation';
import {AppColors} from '../Common/AppColor';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

const MapPickerModal = ({
  visible,
  onClose,
  onSelectLocation,
  initialCoords,
}) => {
  const [selectedCoords, setSelectedCoords] = useState(
    initialCoords || {
      latitude: 9.18125402446766,
      longitude: 105.1501653913437,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    },
  );
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState('');
  const [movingToCurrentLocation, setMovingToCurrentLocation] = useState(false);
  const mapRef = useRef(null);

  const handleMapPress = async event => {
    const {latitude, longitude} = event.nativeEvent.coordinate;
    setSelectedCoords({
      ...selectedCoords,
      latitude,
      longitude,
    });

    // Get address from coordinates
    setLoading(true);
    try {
      const response = await Geocoder.from(latitude, longitude);
      if (response.results.length > 0) {
        const formattedAddress = response.results[0].formatted_address;
        setAddress(formattedAddress);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setAddress('');
    }
    setLoading(false);
  };

  const handleConfirm = () => {
    const coordString = `${selectedCoords.latitude}, ${selectedCoords.longitude}`;
    onSelectLocation({
      coordinates: coordString,
      address: address,
      latitude: selectedCoords.latitude,
      longitude: selectedCoords.longitude,
    });
    onClose();
  };

  const moveToCurrentLocation = () => {
    setMovingToCurrentLocation(true);

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        const newCoords = {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        // Animate map to new location
        if (mapRef.current) {
          mapRef.current.animateToRegion(newCoords, 1000);
        }

        // Update selected coordinates
        setSelectedCoords(newCoords);

        // Get address from coordinates
        setLoading(true);
        try {
          const response = await Geocoder.from(latitude, longitude);
          if (response.results.length > 0) {
            const formattedAddress = response.results[0].formatted_address;
            setAddress(formattedAddress);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          setAddress('');
        }
        setLoading(false);
        setMovingToCurrentLocation(false);
      },
      error => {
        console.error('Location error:', error);
        setMovingToCurrentLocation(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Icon name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chọn vị trí trên bản đồ</Text>
          <View style={{width: 40}} />
        </View>

        {/* Map */}
        <MapView
          ref={mapRef}
          provider={
            Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
          }
          style={styles.map}
          initialRegion={selectedCoords}
          onPress={handleMapPress}
          showsUserLocation
          showsMyLocationButton>
          <Marker
            coordinate={{
              latitude: selectedCoords.latitude,
              longitude: selectedCoords.longitude,
            }}
            draggable
            onDragEnd={handleMapPress}>
            <View style={styles.markerContainer}>
              <Icon name="map-marker" size={40} color={AppColors.MainColor} />
            </View>
          </Marker>
        </MapView>

        {/* Current Location Button */}
        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={moveToCurrentLocation}
          disabled={movingToCurrentLocation}>
          {movingToCurrentLocation ? (
            <ActivityIndicator size="small" color={AppColors.MainColor} />
          ) : (
            <Icon name="crosshairs-gps" size={24} color={AppColors.MainColor} />
          )}
        </TouchableOpacity>

        {/* Info Panel */}
        <View style={styles.infoPanel}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={AppColors.MainColor} />
              <Text style={styles.loadingText}>Đang lấy địa chỉ...</Text>
            </View>
          ) : (
            <>
              <View style={styles.infoRow}>
                <Icon name="map-marker" size={20} color="#666" />
                <Text style={styles.infoLabel}>Tọa độ:</Text>
              </View>
              <Text style={styles.coordsText}>
                {selectedCoords.latitude.toFixed(6)},{' '}
                {selectedCoords.longitude.toFixed(6)}
              </Text>

              {address && (
                <>
                  <View style={[styles.infoRow, {marginTop: 12}]}>
                    <Icon name="map-marker-radius" size={20} color="#666" />
                    <Text style={styles.infoLabel}>Địa chỉ:</Text>
                  </View>
                  <Text style={styles.addressText}>{address}</Text>
                </>
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
            disabled={loading}>
            <Icon name="check" size={20} color="#fff" />
            <Text style={styles.confirmButtonText}>Xác nhận vị trí</Text>
          </TouchableOpacity>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Chạm vào bản đồ để chọn vị trí chính xác
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
  },
  infoPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  coordsText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 28,
    fontWeight: '600',
    letterSpacing: 0.5,
    // fontWeight: '600',
    // fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 28,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: AppColors.MainColor,
    borderRadius: 8,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  instructionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 110 : 90,
    left: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 12,
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  instructionsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  currentLocationButton: {
    position: 'absolute',
    right: 16,
    bottom: 240,
    backgroundColor: '#fff',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default MapPickerModal;
