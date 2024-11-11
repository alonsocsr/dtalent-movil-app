import { View, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, ScrollView, SafeAreaView,  Modal, Switch} from 'react-native';
import { Surface } from 'react-native-paper';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { Receipt, ApiReceiptResponse } from '@/lib/types';

const ReceiptsPage = () => {

  const { token } = useAuth();
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('recent');
  const [filters, setFilters] = useState({
    year: null as number | null,
    isSended: null as boolean | null,
    isReaded: null as boolean | null,
    isSigned: null as boolean | null,
  });
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [numPages, setNumPages] = useState<number>(1);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const queryString = new URLSearchParams({
        page: page.toString(),
        sort: sortOrder,
        search: searchQuery,
        year: filters.year ? filters.year.toString() : '',
        isSended: filters.isSended !== null ? filters.isSended.toString() : '',
        isReaded: filters.isReaded !== null ? filters.isReaded.toString() : '',
        isSigned: filters.isSigned !== null ? filters.isSigned.toString() : '',
      });

      const response = await fetch(`https://api.schneck.dlab.software/api/receipts?${queryString.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data: ApiReceiptResponse = await response.json();
      setReceipts(data.results);
      setNumPages(data.numPages);
    } catch (error) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, [page, sortOrder, searchQuery, filters]);

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(prevOrder => (prevOrder === 'recent' ? 'oldest' : 'recent'));
  };

  
  // Handle opening and closing the filter panel
  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  // Update individual filter
  const updateFilter = (key: keyof typeof filters, value: any) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      year: null,
      isSended: null,
      isReaded: null,
      isSigned: null,
    });
    setShowFilterPanel(false); // Close the filter panel
  };

  // Pagination Control
  const goToNextPage = () => {
    if (page < numPages) setPage(prevPage => prevPage + 1);
  };

  const goToPreviousPage = () => {
    if (page > 1) setPage(prevPage => prevPage - 1);
  };
  
  // Render each receipt row
  const renderReceipt = ({ item }: { item: Receipt }) => (
    <ScrollView horizontal style={{ height: 60 }} contentContainerStyle={{ alignItems: 'center' }}>
      <View className='flex-row items-center bg-white p-3 rounded-lg mb-3'>
        <Text className='text-center' style={{ minWidth: 80 }}>{item.type}</Text>
        <Text className='text-center' style={{ minWidth: 80 }}>{item.employee}</Text>
        <Text className='text-center' style={{ minWidth: 100 }}>{item.fullDate}</Text>
        <View style={{ minWidth: 80, alignItems: 'center' }}>
          {item.isSended ? (
            <MaterialIcons name="done" size={20} color="green" />
          ) : (
            <MaterialIcons name="close" size={20} color="red" />
          )}
        </View>
        <View style={{ minWidth: 80, alignItems: 'center' }}>
          {item.isReaded ? (
            <MaterialIcons name="done" size={20} color="green" />
          ) : (
            <MaterialIcons name="close" size={20} color="red" />
          )}
        </View>
        <View style={{ minWidth: 80, alignItems: 'center' }}>
          {item.isSigned ? (
            <MaterialIcons name="done" size={20} color="green" />
          ) : (
            <MaterialIcons name="close" size={20} color="red" />
          )}
        </View>
      </View>
    </ScrollView>
  );

  return (
      
    <SafeAreaView  className='flex-1'>
      {/* Header */}
      <Surface 
        className='flex-col mb-4 p-4 bg-white'
        style={{ elevation: 2 }}
      >
        <View className="flex-row space-x-2 mb-4">
          <Text className="text-2xl font-bold">Lista de recibos</Text>
          <View className="bg-blue-500 px-4 py-1 rounded-full">
            <Text className="text-white text-sm">{receipts?.length ?? 0}</Text>
          </View>
        </View>
        
        {/* Refresh Button */}
        <TouchableOpacity 
          className='flex-row bg-blue-500 p-4 rounded-lg mr-4 mb-4'
          onPress={fetchReceipts}
        >
          <MaterialIcons name="refresh" size={20} color="white" />
          <Text className='text-white max-w-xs ml-2 font-semibold'>REFRESCAR LISTA DE RECIBOS</Text>
        </TouchableOpacity>
      </Surface>

      

      <View className='flex-1 bg-gray-100 p-4'>
        {/* Filter and Sort */}
        <View className='flex-row justify-between items-center mb-4'>
          <TouchableOpacity onPress={() => setSortOrder(sortOrder === 'recent' ? 'oldest' : 'recent')}>
            <Text className='text-black'>{sortOrder === 'recent' ? 'Más recientes' : 'Más antiguos'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleFilterPanel}>
            <Text className='text-blue-500'>Agregar filtro +</Text>
          </TouchableOpacity>
        </View>

        {/* Display Selected Filters */}
        <View className="flex-row space-x-2 mb-4">
          {filters.year && <Text className='text-sm'>Año: {filters.year}</Text>}
          {filters.isSended !== null && <Text className='text-sm'>Enviado: {filters.isSended ? 'Sí' : 'No'}</Text>}
          {filters.isReaded !== null && <Text className='text-sm'>Leído: {filters.isReaded ? 'Sí' : 'No'}</Text>}
          {filters.isSigned !== null && <Text className='text-sm'>Firmado: {filters.isSigned ? 'Sí' : 'No'}</Text>}
        </View>

        {/* Search Bar */}
        <TextInput
          className='bg-white p-3 rounded-lg mb-4'
          placeholder="Buscar recibos"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filter Panel Modal */}
        <Modal visible={showFilterPanel} transparent={true} animationType="slide">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white p-6 rounded-lg w-80">
              <Text className="text-lg font-bold mb-4">Filtrar recibos</Text>
              <TextInput
                placeholder="Año"
                keyboardType="numeric"
                value={filters.year?.toString() || ''}
                onChangeText={(text) => updateFilter('year', parseInt(text) || null)}
                className="bg-gray-200 p-2 rounded mb-4"
              />
              <View className="flex-row justify-between items-center mb-4">
                <Text>Enviado</Text>
                <Switch
                  value={filters.isSended || false}
                  onValueChange={(value) => updateFilter('isSended', value)}
                />
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <Text>Leído</Text>
                <Switch
                  value={filters.isReaded || false}
                  onValueChange={(value) => updateFilter('isReaded', value)}
                />
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <Text>Firmado</Text>
                <Switch
                  value={filters.isSigned || false}
                  onValueChange={(value) => updateFilter('isSigned', value)}
                />
              </View>
               {/* Apply and Clear Filters Buttons */}
               <TouchableOpacity onPress={toggleFilterPanel} className="bg-blue-500 p-2 rounded-lg mt-4">
                <Text className="text-white text-center">Aplicar filtros</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={clearFilters} className="bg-red-500 p-2 rounded-lg mt-2">
                <Text className="text-white text-center">Borrar filtros</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Receipt List Header */}
        <ScrollView 
          horizontal
          style={{ height: 50, maxHeight:50 }} 
          contentContainerStyle={{ alignItems: 'center' }}
          className='bg-blue-500 p-3 rounded-t-lg'
        >
          <Text className='flex-1 text-white text-center' style={{ minWidth: 80 }}>Tipo</Text>
          <Text className='flex-1 text-white text-center' style={{ minWidth: 80 }}>Empleado</Text>
          <Text className='flex-1 text-white text-center' style={{ minWidth: 80 }}>Fecha</Text>
          <Text className='flex-1 text-white text-center' style={{ minWidth: 80 }}>Enviado</Text>
          <Text className='flex-1 text-white text-center' style={{ minWidth: 80 }}>Leído</Text>
          <Text className='flex-1 text-white text-center' style={{ minWidth: 80 }}>Firmado</Text>
        </ScrollView>

        {/* Receipt List */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={receipts}
            renderItem={renderReceipt}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ backgroundColor: "#fff" }}
            className='rounded-b-lg'
          />
        )}

        {/* Pagination */}
        <View className='flex-row justify-center items-center mt-4'>
          <TouchableOpacity onPress={goToPreviousPage} disabled={page === 1} className='p-2'>
            <MaterialIcons name="navigate-before" size={24} color={page === 1 ? 'gray' : 'black'} />
          </TouchableOpacity>
          <Text className='mx-4'>{page}</Text>
          <TouchableOpacity onPress={goToNextPage} disabled={page === numPages} className='p-2'>
            <MaterialIcons name="navigate-next" size={24} color={page === numPages ? 'gray' : 'black'} />
          </TouchableOpacity>
        </View>

      </View>      
    </SafeAreaView>
  );
};

export default ReceiptsPage;