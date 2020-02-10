package com.example.area_android.ui.settings

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.core.extensions.authentication
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import org.json.JSONArray
import org.json.JSONObject

class SettingsFragment : Fragment() {

    private lateinit var settingsViewModel: SettingsViewModel

    @SuppressLint("SetTextI18n")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        settingsViewModel =
            ViewModelProviders.of(this).get(SettingsViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_settings, container, false)

        val app : AreaApplication = this.activity!!.application as AreaApplication


        val url : String = app.serverUrl + "/me"
        Fuel.get(url)
            .authentication()
            .bearer(app.token!!)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        print("FAILURE SETTINGS FRAGMENT : " + result.toString() + "\n")

                    }
                    is Result.Success -> {
                        val obj : JSONObject = result.get().obj()
                        val data : JSONObject = obj.getJSONObject("data")
                        print("SUCCESS SETT FRAGMENT data : " + result.get().obj().toString() + "  \n")
                        root.findViewById<TextView>(R.id.settings_email_text).text = "Email : " + data.getString("email")
                        root.findViewById<TextView>(R.id.settings_username_text).text = "Username : " + data.getString("username")
                    }
                }
            }
        return root
    }
}