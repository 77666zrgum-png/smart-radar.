import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { Magnetometer } from 'expo-sensors';

const { width } = Dimensions.get('window');

// قاموس اللغات للتطبيق (عربي / إنجليزي)
const translations = {
  en: {
    scanTitle: '🛸 SCANNING FOR THREATS',
    dangerTitle: '⚠️ ALERT: PROBABLE CAMERA DETECTED',
    safe: 'SAFE',
    danger: 'DANGER',
    axisX: 'X Axis',
    axisY: 'Y Axis',
    axisZ: 'Z Axis',
    back: '← Back to Subscriptions',
    logoSub: 'Protect your privacy everywhere you go',
    choosePlan: 'CHOOSE YOUR PLAN',
    monthly: 'Monthly Plan',
    annual: 'Annual Plan',
    save: 'SAVE 40%',
    payBtn: 'Pay Securely with Mastercard',
    cardNum: 'Mastercard Number',
    cardExpiry: 'MM/YY',
    cardCvc: 'CVC',
    processing: 'Connecting to Mastercard...',
    success: 'Payment successful! Premium features unlocked.',
    fillFields: 'Please fill in all Mastercard details.'
  },
  ar: {
    scanTitle: '🛸 جاري فحص التهديدات المحيطة',
    dangerTitle: '⚠️ تحذير: تم رصد كاميرا مخفية محتملة!',
    safe: 'آمن',
    danger: 'خطر',
    axisX: 'محور X',
    axisY: 'محور Y',
    axisZ: 'محور Z',
    back: '← العودة لشاشة الباقات',
    logoSub: 'احمِ خصوصيتك وأمانك أينما ذهبت',
    choosePlan: 'اختر خطة الاشتراك المناسبة',
    monthly: 'الاشتراك الشهري',
    annual: 'الاشتراك السنوي الذهبي',
    save: 'وفر 40%',
    payBtn: 'ادفع الآن بأمان عبر ماستركارد',
    cardNum: 'رقم بطاقة الماستركارد',
    cardExpiry: 'الشهر / السنة',
    cardCvc: 'الرمز السري CVC',
    processing: 'جاري الاتصال بـ Mastercard...',
    success: 'تمت عملية الدفع بنجاح! تم تفعيل الرادار.',
    fillFields: 'الرجاء إدخال بيانات الماستركارد كاملة.'
  }
};

export default function App() {
  const [lang, setLang] = useState('ar'); // اللغة الافتراضية العربية
  const [subscribed, setSubscribed] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('annual');
  const [magnetData, setMagnetData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  
  // حقول بطاقة الماستركارد
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const t = translations[lang];

  // حساب القيمة الكلية للحقل المغناطيسي (µT)
  const totalMagnitude = Math.sqrt(
    Math.pow(magnetData.x, 2) + Math.pow(magnetData.y, 2) + Math.pow(magnetData.z, 2)
  ).toFixed(1);

  const isDanger = totalMagnitude > 100;

  useEffect(() => {
    if (subscribed) {
      _subscribe();
    }
    return () => _unsubscribe();
  }, [subscribed]);

  const _subscribe = () => {
    Magnetometer.setUpdateInterval(500);
    setSubscription( Magnetometer.addListener(result => setMagnetData(result)) );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const handlePayment = () => {
    if (!cardNumber || !expiry || !cvc) {
      alert(t.fillFields);
      return;
    }
    setLoading(true);
    // محاكاة الدفع عبر الماستركارد
    setTimeout(() => {
      setLoading(false);
      alert(t.success);
      setSubscribed(true);
    }, 2500);
  };

  return (
    <View style={[styles.container, lang === 'ar' && { direction: 'rtl' }]}>
      
      <TouchableOpacity style={styles.langToggle} onPress={() => setLang(lang === 'ar' ? 'en' : 'ar')}>
        <Text style={styles.langToggleText}>{lang === 'ar' ? '🌐 English' : '🌐 العربية'}</Text>
      </TouchableOpacity>

      {!subscribed ? (
        // 1️⃣ شاشة الدفع المحصورة ببطاقة الـ Mastercard والباقات
        <View style={styles.innerContainer}>
          <View style={styles.headerCircle}>
            <Text style={styles.logoText}>👁️‍🗨️</Text>
          </View>
          <Text style={styles.title}>CamDetect Pro</Text>
          <Text style={styles.subtitle}>{t.logoSub}</Text>

          <Text style={styles.sectionTitle}>{t.choosePlan}</Text>
          
          <View style={styles.plansRow}>
            <TouchableOpacity 
              style={[styles.planCard, selectedPlan === 'monthly' && styles.activePlan]}
              onPress={() => setSelectedPlan('monthly')}
            >
              <Text style={styles.planName}>{t.monthly}</Text>
              <Text style={styles.planPrice}>{selectedPlan === 'monthly' ? '$4.99' : '$4.99'}</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.planCard, selectedPlan === 'annual' && styles.activePlan]}
              onPress={() => setSelectedPlan('annual')}
            >
              <View style={styles.badge}><Text style={styles.badgeText}>{t.save}</Text></View>
              <Text style={styles.planName}>{t.annual}</Text>
              <Text style={styles.planPrice}>$2.99 <Text style={{fontSize:11, color:'#8892b0'}}>/mo</Text></Text>
            </TouchableOpacity>
          </View>

          <View style={styles.cardInputContainer}>
            <Text style={styles.cardBrandText}>💳 MasterCard SecurePay</Text>
            <TextInput 
              style={styles.input} 
              placeholder={t.cardNum} 
              placeholderTextColor="#556080"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TextInput 
                style={[styles.input, {width: '48%'}]} 
                placeholder={t.cardExpiry} 
                placeholderTextColor="#556080"
                keyboardType="numeric"
                value={expiry}
                onChangeText={setExpiry}
              />
              <TextInput 
                style={[styles.input, {width: '48%'}]} 
                placeholder={t.cardCvc} 
                placeholderTextColor="#556080"
                keyboardType="numeric"
                secureTextEntry={true}
                value={cvc}
                onChangeText={setCvc}
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handlePayment} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? t.processing : t.payBtn}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // 2️⃣ شاشة الرادار الذكي (تدعم اللغتين تلقائياً)
        <View style={styles.innerContainer}>
          <Text style={[styles.statusText, isDanger && styles.dangerText]}>
            {isDanger ? t.dangerTitle : t.scanTitle}
          </Text>

          <View style={[styles.radarCircle, isDanger && styles.dangerRadar]}>
            <Text style={[styles.magnitudeNumber, isDanger && styles.dangerText]}>{totalMagnitude}</Text>
            <Text style={styles.unitText}>µT</Text>
            <View style={[styles.statusBadge, isDanger && styles.dangerBadge]}>
              <Text style={styles.statusBadgeText}>{isDanger ? t.danger : t.safe}</Text>
            </View>
          </View>

          <View style={styles.axisContainer}>
            <Text style={styles.axisLabel}>{t.axisX}: {magnetData.x.toFixed(1)}</Text>
            <Text style={styles.axisLabel}>{t.axisY}: {magnetData.y.toFixed(1)}</Text>
            <Text style={styles.axisLabel}>{t.axisZ}: {magnetData.z.toFixed(1)}</Text>
          </View>

          <TouchableOpacity style={[styles.button, {backgroundColor: '#10141e'}]} onPress={() => setSubscribed(false)}>
            <Text style={{color: '#00f0ff', fontWeight: 'bold'}}>{t.back}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#070a13', padding: 20 },
  innerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', width: '100%' },
  langToggle: { position: 'absolute', top: 50, right: 20, backgroundColor: '#1d294d', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, zIndex: 10 },
  langToggleText: { color: '#00f0ff', fontSize: 13, fontWeight: 'bold' },
  headerCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#00f0ff15', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#00f0ff', marginBottom: 10 },
  logoText: { fontSize: 35 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  subtitle: { fontSize: 13, color: '#8892b0', marginBottom: 25, textAlign: 'center' },
  sectionTitle: { color: '#8892b0', fontSize: 12, fontWeight: 'bold', alignSelf: 'flex-start', marginBottom: 10 },
  plansRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 20 },
  planCard: { width: '48%', backgroundColor: '#0d1326', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#1d294d', position: 'relative' },
  activePlan: { borderColor: '#00f0ff', backgroundColor: '#00f0ff05' },
  badge: { position: 'absolute', top: -10, left: 10, backgroundColor: '#a020f0', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  badgeText: { color: '#fff', fontSize: 9, fontWeight: 'bold' },
  planName: { color: '#8892b0', fontSize: 13, marginBottom: 5 },
  planPrice: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  cardInputContainer: { width: '100%', backgroundColor: '#0d1326', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#1d294d', marginBottom: 20 },
  cardBrandText: { color: '#00f0ff', fontSize: 12, fontWeight: 'bold', marginBottom: 12 },
  input: { backgroundColor: '#070a13', color: '#fff', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#1d294d', marginBottom: 10, fontSize: 14, textAlign: 'left' },
  button: { width: '100%', backgroundColor: '#00f0ff', padding: 15, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#070a13', fontSize: 15, fontWeight: 'bold' },
  statusText: { fontSize: 15, fontWeight: 'bold', color: '#00f0ff', marginBottom: 30, textAlign: 'center' },
  radarCircle: { width: 220, height: 220, borderRadius: 110, borderWidth: 3, borderColor: '#00f0ff', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  dangerRadar: { borderColor: '#ff3366' },
  dangerText: { color: '#ff3366' },
  magnitudeNumber: { fontSize: 44, fontWeight: 'bold', color: '#00f0ff' },
  unitText: { color: '#8892b0', fontSize: 13, marginTop: 3 },
  statusBadge: { backgroundColor: '#00f0ff22', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15, marginTop: 10 },
  dangerBadge: { backgroundColor: '#ff336622' },
  statusBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  axisContainer: { width: '100%', paddingHorizontal: 20, marginBottom: 25 },
  axisLabel: { color: '#8892b0', fontSize: 13, marginVertical: 3, textAlign: 'left' }
});

